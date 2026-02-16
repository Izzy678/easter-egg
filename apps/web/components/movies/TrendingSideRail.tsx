'use client';

import { TrendingUpIcon, MessageCircleIcon, PlayIcon, ZapIcon } from 'lucide-react';
import Link from 'next/link';

export function TrendingSideRail() {
    return (
        <aside className="hidden lg:block w-80 min-w-80 space-y-8 sticky top-8 self-start">
            {/* Top Theories */}
            <div className="bg-card/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4 text-primary-500 font-bold uppercase tracking-wider text-xs">
                    <TrendingUpIcon className="w-4 h-4" />
                    Top Theories Today
                </div>
                <div className="space-y-4">
                    {[
                        { title: 'Is Inception actually a dream within a dream?', comments: '1.2k', movie: 'Inception' },
                        { title: 'The hidden meaning of the monolith in 2001', comments: '850', movie: '2001: A Space Odyssey' },
                        { title: 'Did Deckard know he was a replicant?', comments: '620', movie: 'Blade Runner 2049' },
                    ].map((theory, i) => (
                        <Link href="#" key={i} className="block group">
                            <h4 className="text-sm font-semibold text-white group-hover:text-primary-500 transition-colors line-clamp-2 leading-relaxed">
                                {theory.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                <span className="font-medium text-primary-400">{theory.movie}</span>
                                <span>•</span>
                                <span>{theory.comments} comments</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Most Discussed Movies */}
            <div className="bg-card/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4 text-secondary-foreground font-bold uppercase tracking-wider text-xs">
                    <MessageCircleIcon className="w-4 h-4 text-secondary-500" />
                    Most Discussed This Week
                </div>
                <div className="space-y-3">
                    {[
                        { title: 'Dune: Part Two', count: '5.4k posts' },
                        { title: 'Oppenheimer', count: '3.2k posts' },
                        { title: 'Everything Everywhere', count: '2.8k posts' },
                        { title: 'The Batman', count: '2.1k posts' },
                    ].map((movie, i) => (
                        <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors -mx-2">
                            <span className="text-sm text-gray-300 font-medium group-hover:text-white transition-colors">{movie.title}</span>
                            <span className="text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                                {movie.count}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Recap Links */}
            <div className="bg-card border border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4 text-white font-bold text-sm">
                    <ZapIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    Quick Recap
                </div>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                    Need a refresher before the sequel? Get 3-minute summaries of key plot points.
                </p>
                <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 border border-white/10">
                    <PlayIcon className="w-3 h-3 fill-current" />
                    Watch Latest Recaps
                </button>
            </div>

            {/* Footer Links */}
            <div className="text-xs text-muted-foreground space-x-3 px-2">
                <Link href="#" className="hover:text-white transition-colors">About</Link>
                <Link href="#" className="hover:text-white transition-colors">Guidelines</Link>
                <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                <span>© 2024 CineMinds</span>
            </div>
        </aside>
    );
}
