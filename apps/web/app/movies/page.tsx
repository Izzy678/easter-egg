'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/movies/Sidebar';
import { MoviesHeader } from '@/components/movies/MoviesHeader';
import { DiscussionCard } from '@/components/movies/DiscussionCard';
import { TrendingSideRail } from '@/components/movies/TrendingSideRail';

export default function MoviesPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Mock data for feed
    const posts = [
        {
            movieTitle: 'Interstellar',
            topicTitle: 'The Tesseract scene wasn\'t about love, it was about gravity',
            previewText:
                'Everyone focuses on the "love transcends dimensions" line, but the actual mechanics of the 5th dimension suggest Cooper was manipulating gravity waves long before he entered the black hole. Here\'s the math behind it...',
            author: { name: 'CosmicRay', avatar: '/static/images/people/1.webp' },
            tags: ['Physics', 'Deep Dive'],
            stats: { comments: 850, likes: 3200, timeAgo: '2h ago' },
            poster: '/static/images/2.jpg',
        },
        {
            movieTitle: 'Dark (Series)',
            topicTitle: 'Why Adam and Eve discussion is flawed from the start',
            previewText:
                'The loop isn\'t broken by their death, but by the realization of the origin world. The knot is far more complex than a simple dualism. Let\'s map out the family tree one last time to find the true anomaly.',
            author: { name: 'TimeTravelerZero', avatar: '/static/images/people/1.webp' },
            tags: ['Series', 'Complex', 'Spoilers'],
            stats: { comments: 420, likes: 1500, timeAgo: '6h ago' },
            poster: '/static/images/3.jpg',
        },
        {
            movieTitle: 'The Prestige',
            topicTitle: 'The real magic trick was the structural narrative',
            previewText:
                'Nolan hides the twist in plain sight, not just through dialogue, but through the editing itself. The three distinct acts (Pledge, Turn, Prestige) map perfectly to the three timelines shown.',
            author: { name: 'CinemaSinsNot', avatar: '/static/images/people/1.webp' },
            tags: ['Analysis', 'Directing'],
            stats: { comments: 230, likes: 890, timeAgo: '12h ago' },
            poster: '/static/images/4.jpg',
        },
        {
            movieTitle: 'Blade Runner 2049',
            topicTitle: 'K\'s memory was real, just not his own',
            previewText:
                'The horse memory is key. It wasn\'t an implant in the traditional sense, but a shared trauma. This fundamentally changes how we view replicant consciousness and the "soul" debate.',
            author: { name: 'ReplicantHunter', avatar: '/static/images/people/1.webp' },
            tags: ['Philosophy', 'Character Study'],
            stats: { comments: 560, likes: 2100, timeAgo: '1d ago' },
            poster: '/static/images/5.jpg',
        },
        {
            movieTitle: 'Arrival',
            topicTitle: 'Why the heptapod language rewrites cause and effect',
            previewText:
                'Louise doesn\'t just learn the language—she gains a non-linear perception of time. The film\'s structure itself mirrors this: the "flashbacks" are actually her future memories. Here\'s how the script hides the twist.',
            author: { name: 'LinguistNerd', avatar: '/static/images/people/1.webp' },
            tags: ['Linguistics', 'Time'],
            stats: { comments: 410, likes: 1800, timeAgo: '2d ago' },
            poster: '/static/images/2.jpg',
        },
        {
            movieTitle: 'Parasite',
            topicTitle: 'The stone and the basement: symbols of impossible mobility',
            previewText:
                'The scholar\'s stone keeps floating up; the basement family can never rise. Bong Joon-ho layers class critique through these two motifs. We break down every recurrence and what they mean for the ending.',
            author: { name: 'ClassCritic', avatar: '/static/images/people/1.webp' },
            tags: ['Class', 'Symbolism'],
            stats: { comments: 720, likes: 2900, timeAgo: '3d ago' },
            poster: '/static/images/3.jpg',
        },
        {
            movieTitle: 'Eternal Sunshine of the Spotless Mind',
            topicTitle: 'Lacuna\'s tech doesn\'t erase—it rewrites the narrative',
            previewText:
                'The procedure doesn\'t just delete memories; it constructs a new story where the person never existed. That\'s why Joel and Clementine keep finding each other—the gap in the narrative creates its own pull.',
            author: { name: 'MemoryPalace', avatar: '/static/images/people/1.webp' },
            tags: ['Memory', 'Romance'],
            stats: { comments: 380, likes: 1650, timeAgo: '4d ago' },
            poster: '/static/images/4.jpg',
        },
        {
            movieTitle: 'Eternal Sunshine of the Spotless Mind',
            topicTitle: 'Lacuna\'s tech doesn\'t erase—it rewrites the narrative',
            previewText:
                'The procedure doesn\'t just delete memories; it constructs a new story where the person never existed. That\'s why Joel and Clementine keep finding each other—the gap in the narrative creates its own pull.',
            author: { name: 'MemoryPalace', avatar: '/static/images/people/1.webp' },
            tags: ['Memory', 'Romance'],
            stats: { comments: 380, likes: 1650, timeAgo: '4d ago' },
            poster: '/static/images/4.jpg',
        },
        {
            movieTitle: 'Eternal Sunshine of the Spotless Mind',
            topicTitle: 'Lacuna\'s tech doesn\'t erase—it rewrites the narrative',
            previewText:
                'The procedure doesn\'t just delete memories; it constructs a new story where the person never existed. That\'s why Joel and Clementine keep finding each other—the gap in the narrative creates its own pull.',
            author: { name: 'MemoryPalace', avatar: '/static/images/people/1.webp' },
            tags: ['Memory', 'Romance'],
            stats: { comments: 380, likes: 1650, timeAgo: '4d ago' },
            poster: '/static/images/4.jpg',
        },
        {
            movieTitle: 'Eternal Sunshine of the Spotless Mind',
            topicTitle: 'Lacuna\'s tech doesn\'t erase—it rewrites the narrative',
            previewText:
                'The procedure doesn\'t just delete memories; it constructs a new story where the person never existed. That\'s why Joel and Clementine keep finding each other—the gap in the narrative creates its own pull.',
            author: { name: 'MemoryPalace', avatar: '/static/images/people/1.webp' },
            tags: ['Memory', 'Romance'],
            stats: { comments: 380, likes: 1650, timeAgo: '4d ago' },
            poster: '/static/images/4.jpg',
        },
        {
            movieTitle: 'Eternal Sunshine of the Spotless Mind',
            topicTitle: 'Lacuna\'s tech doesn\'t erase—it rewrites the narrative',
            previewText:
                'The procedure doesn\'t just delete memories; it constructs a new story where the person never existed. That\'s why Joel and Clementine keep finding each other—the gap in the narrative creates its own pull.',
            author: { name: 'MemoryPalace', avatar: '/static/images/people/1.webp' },
            tags: ['Memory', 'Romance'],
            stats: { comments: 380, likes: 1650, timeAgo: '4d ago' },
            poster: '/static/images/4.jpg',
        },
        {
            movieTitle: 'Eternal Sunshine of the Spotless Mind',
            topicTitle: 'Lacuna\'s tech doesn\'t erase—it rewrites the narrative',
            previewText:
                'The procedure doesn\'t just delete memories; it constructs a new story where the person never existed. That\'s why Joel and Clementine keep finding each other—the gap in the narrative creates its own pull.',
            author: { name: 'MemoryPalace', avatar: '/static/images/people/1.webp' },
            tags: ['Memory', 'Romance'],
            stats: { comments: 380, likes: 1650, timeAgo: '4d ago' },
            poster: '/static/images/4.jpg',
        }
    ];

    return (
        <div className="w-full h-screen overflow-hidden bg-background text-foreground flex flex-col">
            {/* Layout Container - h-full so it doesn't exceed viewport */}
            <div className="flex flex-1 min-h-0">
                {/* Sidebar - fixed to viewport */}
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* Main Content - ml-64 offsets fixed sidebar; min-h-0 lets this shrink so inner div can scroll */}
                <main className="flex-1 min-w-0 min-h-0 lg:ml-64 flex flex-col">
                    {/* Header - fixed to viewport */}
                    <MoviesHeader onMenuClick={() => setSidebarOpen(true)} />

                    {/* Only this div scrolls - sidebar and rail stay put */}
                    <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pt-20 pb-12">
                        {/* Content Grid */}
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-20">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Column: Discussion Feed */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-bold text-foreground">Feeds</h2>
                                        <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
                                            <button className="px-3 py-1.5 text-xs font-medium text-foreground bg-white/10 rounded-md shadow-sm">Hot</button>
                                            <button className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-md transition-colors">New</button>
                                            <button className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-md transition-colors">Top</button>
                                        </div>
                                    </div>

                                    {posts.map((post, index) => (
                                        <DiscussionCard key={index} {...post} />
                                    ))}
                                </div>

                                {/* Right Column: Trending Side Rail */}
                                <div className="lg:col-span-1 hidden lg:block">
                                    <TrendingSideRail />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
