'use client';

import { useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

interface MovieSectionProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

export function MovieSection({ title, subtitle, children }: MovieSectionProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 400;
            const newScrollPosition =
                scrollRef.current.scrollLeft +
                (direction === 'left' ? -scrollAmount : scrollAmount);

            scrollRef.current.scrollTo({
                left: newScrollPosition,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="mb-8">
            {/* Section Header */}
            <div className="flex items-end justify-between mb-4 px-6 lg:px-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
                    {subtitle && (
                        <p className="text-sm text-gray-400">{subtitle}</p>
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white flex items-center justify-center transition-all hover:scale-110"
                        aria-label="Scroll left"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white flex items-center justify-center transition-all hover:scale-110"
                        aria-label="Scroll right"
                    >
                        <ChevronRightIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Scrollable Content */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide px-6 lg:px-8 pb-4"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
            >
                {children}
            </div>
        </div>
    );
}
