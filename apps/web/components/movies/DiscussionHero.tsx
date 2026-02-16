'use client';

import { MessageSquareIcon, BookOpenIcon, ZapIcon, FlameIcon } from 'lucide-react';
import Image from 'next/image';

interface DiscussionHeroProps {
    movieTitle: string;
    topicTitle: string;
    description: string;
    commentCount: string;
    timeAgo: string;
    backgroundImage: string;
    tags?: string[];
}

export function DiscussionHero({
    movieTitle,
    topicTitle,
    description,
    commentCount,
    timeAgo,
    backgroundImage,
    tags = [],
}: DiscussionHeroProps) {
    return (
        <div className="relative w-full h-[60vh] min-h-[500px] flex items-end">
            {/* Background Image with stronger overlay for text readability */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={backgroundImage}
                    alt={movieTitle}
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                {/* Layered darkness gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-4xl p-8 mb-8 space-y-6">
                {/* Badge & Movie Title */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/20 border border-primary-500/30 text-primary-500 font-bold text-xs uppercase tracking-wider backdrop-blur-md">
                        <FlameIcon className="w-3 h-3" />
                        Trending Discussion
                    </div>
                    <span className="text-muted-foreground font-medium">•</span>
                    <span className="text-gray-300 font-semibold">{movieTitle}</span>
                </div>

                {/* Main Topic */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight">
                    {topicTitle}
                </h1>

                {/* Description Preview */}
                <p className="text-lg text-muted-foreground max-w-2xl line-clamp-3 leading-relaxed">
                    {description}
                </p>

                {/* Meta & Tags */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                        <MessageSquareIcon className="w-4 h-4 text-primary-500" />
                        <span className="text-white font-medium">{commentCount} comments</span>
                    </div>
                    <span>•</span>
                    <span>{timeAgo}</span>
                    <div className="flex gap-2 ml-4">
                        {tags.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-xs text-gray-300">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-4 pt-4">
                    <button className="px-8 py-3.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary-500/25 flex items-center gap-2 hover:scale-105">
                        <MessageSquareIcon className="w-5 h-5" />
                        Join Discussion
                    </button>
                    <button className="px-6 py-3.5 bg-secondary-900/50 hover:bg-secondary-800/50 text-white border border-white/10 rounded-xl font-semibold text-sm transition-all backdrop-blur-sm flex items-center gap-2">
                        <BookOpenIcon className="w-5 h-5" />
                        Read Summary
                    </button>
                    <button className="px-6 py-3.5 bg-secondary-900/50 hover:bg-secondary-800/50 text-white border border-white/10 rounded-xl font-semibold text-sm transition-all backdrop-blur-sm flex items-center gap-2">
                        <ZapIcon className="w-5 h-5 text-yellow-400" />
                        Quick Context
                    </button>
                </div>
            </div>
        </div>
    );
}
