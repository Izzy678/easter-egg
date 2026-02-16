'use client';

import {
    HomeIcon,
    ClockIcon,
    LayoutGridIcon,
    HeartIcon,
    SettingsIcon,
    XIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    SparklesIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const navItems = [
    { icon: HomeIcon, label: 'Home', href: '/movies' },
    { icon: SparklesIcon, label: 'Discover', href: '#' },
    { icon: ClockIcon, label: 'Catch Up', href: '/catch-up' },
    { icon: LayoutGridIcon, label: 'Genres', href: '#' },
    { icon: HeartIcon, label: 'Saved', href: '#' },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 h-screen
          ${isCollapsed ? 'w-20' : 'w-64'}
          bg-card border-r border-white/5
          z-50
          transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
            >
                {/* Header / Logo */}
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-4 h-16 border-b border-white/5`}>
                    {!isCollapsed && (
                        <Link href="/movies" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <div className="w-8 h-8 rounded-xl bg-primary-500/20 flex items-center justify-center text-primary-500 shadow-sm shadow-primary-500/10">
                                <span className="font-bold text-lg">C</span>
                            </div>
                            <span className="font-bold text-lg tracking-tight text-white">CineMinds</span>
                        </Link>
                    )}
                    {isCollapsed && (
                        <div className="w-8 h-8 rounded-xl bg-primary-500/20 flex items-center justify-center text-primary-500">
                            <span className="font-bold text-lg">C</span>
                        </div>
                    )}

                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <XIcon className="w-5 h-5 text-gray-400" />
                    </button>

                    {/* Desktop Collapse Toggle */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:flex p-1.5 hover:bg-white/10 rounded-md text-muted-foreground transition-colors"
                    >
                        {isCollapsed ? <ChevronRightIcon className="w-4 h-4" /> : <ChevronLeftIcon className="w-4 h-4" />}
                    </button>
                </div>

                {/* Navigation Scroll Area */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2 scrollbar-hide">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '#' && pathname?.startsWith(item.href + '/'));
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                                    ${isActive
                                        ? 'bg-primary-500/10 text-primary-500'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }
                                    ${isCollapsed ? 'justify-center' : ''}
                                `}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-primary-500' : ''}`} />
                                {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / Settings */}
                <div className="p-4 border-t border-white/5">
                    <Link
                        href="#"
                        className={`
                            flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors
                            text-gray-400 hover:bg-white/5 hover:text-white
                            ${isCollapsed ? 'justify-center' : ''}
                        `}
                        title={isCollapsed ? 'Settings' : undefined}
                    >
                        <SettingsIcon className="w-5 h-5" />
                        {!isCollapsed && <span className="font-medium text-sm">Settings</span>}
                    </Link>
                </div>
            </aside>
        </>
    );
}
