'use client';

import { SearchIcon, BellIcon, MenuIcon } from 'lucide-react';
import Image from 'next/image';

interface MoviesHeaderProps {
    onMenuClick: () => void;
}

export function MoviesHeader({ onMenuClick }: MoviesHeaderProps) {
    return (
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-white/5 h-16">
            <div className="flex items-center justify-between px-6 lg:px-8 h-full">
                {/* Left: Menu Button (Mobile) + Search */}
                <div className="flex items-center gap-4 flex-1 max-w-2xl">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <MenuIcon className="w-6 h-6 text-gray-300" />
                    </button>

                    {/* Search Bar */}
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search movies, series, directors…"
                            className="
                w-full h-12 pl-12 pr-4
                bg-white/5 hover:bg-white/10 focus:bg-white/10
                border border-white/10 focus:border-primary-500/50
                rounded-full
                text-white placeholder:text-gray-500
                outline-none
                transition-all duration-200
                backdrop-blur-sm
              "
                        />
                    </div>
                </div>

                {/* Right: Notifications + User */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <button className="relative p-2 hover:bg-white/10 rounded-full transition-colors group">
                        <BellIcon className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full border-2 border-background" />
                    </button>

                    {/* User Avatar */}
                    <button className="flex items-center gap-3 p-1 pr-4 hover:bg-white/10 rounded-full transition-colors group">
                        <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center overflow-hidden relative">
                            <Image
                                src="/static/images/people/1.webp"
                                alt="User"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="hidden md:block text-white font-medium text-sm">
                            Sarah J.
                        </span>
                    </button>
                </div>
            </div>
        </header>
    );
}
