'use client';

import { PlayIcon, InfoIcon, SparklesIcon } from 'lucide-react';
import Image from 'next/image';

interface HeroMovieProps {
    title: string;
    description: string;
    backgroundImage: string;
    genres: string[];
    rating?: number;
    year?: string;
}

export function HeroMovie({
    title,
    description,
    backgroundImage,
    genres,
    rating,
    year,
}: HeroMovieProps) {
    return (
        <div className="relative w-full h-[70vh] min-h-[500px] max-h-[700px] overflow-hidden rounded-2xl mx-6 lg:mx-8 mb-8">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src={backgroundImage}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                />
                {/* Multi-layer gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col justify-end p-8 lg:p-12 max-w-3xl">
                {/* Metadata */}
                <div className="flex items-center gap-3 mb-4">
                    {year && (
                        <span className="text-gray-300 font-medium">{year}</span>
                    )}
                    {rating && (
                        <div className="flex items-center gap-1 bg-primary-500/20 backdrop-blur-sm px-2 py-1 rounded-full">
                            <span className="text-yellow-400 text-sm">★</span>
                            <span className="text-white text-sm font-semibold">
                                {rating.toFixed(1)}
                            </span>
                        </div>
                    )}
                    <div className="flex gap-2">
                        {genres.slice(0, 3).map((genre) => (
                            <span
                                key={genre}
                                className="text-xs px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-gray-300 border border-white/20"
                            >
                                {genre}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-5xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl leading-tight">
                    {title}
                </h1>

                {/* Description */}
                <p className="text-gray-300 text-lg mb-6 max-w-2xl leading-relaxed">
                    {description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                    <button className="group relative px-8 py-4 bg-white hover:bg-gray-100 text-black rounded-lg font-bold text-lg flex items-center gap-3 transition-all hover:scale-105 shadow-2xl">
                        <PlayIcon className="w-6 h-6 fill-black" />
                        Play Now
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg opacity-0 group-hover:opacity-20 blur transition-opacity" />
                    </button>

                    <button className="group relative px-8 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-lg font-bold text-lg flex items-center gap-3 transition-all hover:scale-105 border border-white/30">
                        <SparklesIcon className="w-6 h-6" />
                        Why You'll Like This
                    </button>

                    <button className="group relative px-8 py-4 bg-secondary-500/20 hover:bg-secondary-500/30 backdrop-blur-md text-white rounded-lg font-bold text-lg flex items-center gap-3 transition-all hover:scale-105 border border-secondary-500/50">
                        <InfoIcon className="w-6 h-6" />
                        Quick Recap
                    </button>
                </div>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-950 to-transparent pointer-events-none" />
        </div>
    );
}
