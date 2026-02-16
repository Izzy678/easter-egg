'use client';

import { useState } from 'react';
import { PlayIcon, InfoIcon, StarIcon } from 'lucide-react';
import Image from 'next/image';

interface MovieCardProps {
    title: string;
    poster: string;
    year?: string;
    rating?: number;
    genres?: string[];
    moodMatch?: number;
    hasRecap?: boolean;
    progress?: number;
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
}

export function MovieCard({
    title,
    poster,
    year,
    rating,
    genres = [],
    moodMatch,
    hasRecap,
    progress,
    size = 'md',
    onClick,
}: MovieCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    const sizeClasses = {
        sm: 'w-32 h-48',
        md: 'w-40 h-60',
        lg: 'w-48 h-72',
    };

    return (
        <div
            className={`${sizeClasses[size]} flex-shrink-0 rounded-xl overflow-hidden relative group cursor-pointer transition-all duration-300 ${isHovered ? 'scale-105 z-10' : 'scale-100'
                }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            {/* Poster Image */}
            <div className="w-full h-full relative">
                <Image
                    src={poster}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 150px, 200px"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Progress Bar */}
            {progress !== undefined && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                    <div
                        className="h-full bg-primary-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}

            {/* Mood Match Badge */}
            {moodMatch !== undefined && (
                <div className="absolute top-2 right-2 bg-primary-500/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-white">
                    {moodMatch}% Match
                </div>
            )}

            {/* Recap Badge */}
            {hasRecap && (
                <div className="absolute top-2 left-2 bg-secondary-500/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-white">
                    Recap
                </div>
            )}

            {/* Watchlist Badge - can be added via props later */}

            {/* Hover Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">{title}</h3>

                {year && (
                    <p className="text-gray-300 text-xs mb-1">{year}</p>
                )}

                {rating && (
                    <div className="flex items-center gap-1 mb-2">
                        <StarIcon className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-white text-xs font-semibold">{rating.toFixed(1)}</span>
                    </div>
                )}

                {genres.length > 0 && (
                    <div className="flex gap-1 flex-wrap mb-2">
                        {genres.slice(0, 2).map((genre) => (
                            <span
                                key={genre}
                                className="text-[10px] px-1.5 py-0.5 bg-white/20 backdrop-blur-sm rounded text-white"
                            >
                                {genre}
                            </span>
                        ))}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <button className="flex-1 bg-white/90 hover:bg-white text-black rounded-md py-1.5 px-2 text-xs font-semibold flex items-center justify-center gap-1 transition-colors">
                        <PlayIcon className="w-3 h-3" />
                        Play
                    </button>
                    <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-md p-1.5 transition-colors">
                        <InfoIcon className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* Glow effect on hover */}
            {isHovered && (
                <div className="absolute -inset-1 bg-primary-500/40 rounded-xl blur-lg -z-10 transition-all duration-300" />
            )}
        </div>
    );
}
