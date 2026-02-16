'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/movies/Sidebar';
import { MoviesHeader } from '@/components/movies/MoviesHeader';
import { Input } from '@/components/shared/ui/input';
import { SearchIcon } from 'lucide-react';
import { QuickPickRow } from '@/components/catch-up/QuickPickRow';
import { RecapMediaCard, type RecapMediaCardItem } from '@/components/catch-up/RecapMediaCard';
import { RecapMediaCardSkeleton } from '@/components/catch-up/RecapMediaCardSkeleton';

function buildScopeUrl(item: RecapMediaCardItem): string {
  const type = item.media_type === 'tv' ? 'tv' : 'movie';
  return `/catch-up/scope?type=${type}&tmdbId=${item.id}`;
}

export default function CatchUpPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<RecapMediaCardItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [trendingAll, setTrendingAll] = useState<RecapMediaCardItem[]>([]);
  const [trendingAllLoading, setTrendingAllLoading] = useState(true);
  const [popularTv, setPopularTv] = useState<RecapMediaCardItem[]>([]);
  const [popularTvLoading, setPopularTvLoading] = useState(true);
  const [onTheAir, setOnTheAir] = useState<RecapMediaCardItem[]>([]);
  const [onTheAirLoading, setOnTheAirLoading] = useState(true);

  const handleSelect = useCallback(
    (item: RecapMediaCardItem) => {
      router.push(buildScopeUrl(item));
    },
    [router]
  );

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const t = setTimeout(() => {
      setSearchLoading(true);
      fetch(
        `/api/movies/search?query=${encodeURIComponent(searchQuery.trim())}&page=1`
      )
        .then((res) => res.json())
        .then((data) => setSearchResults(data?.results ?? []))
        .catch(() => setSearchResults([]))
        .finally(() => setSearchLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    setTrendingAllLoading(true);
    fetch('/api/movies/trending-all?window=week')
      .then((res) => res.json())
      .then((data) => setTrendingAll(data?.results ?? []))
      .catch(() => setTrendingAll([]))
      .finally(() => setTrendingAllLoading(false));
  }, []);

  useEffect(() => {
    setPopularTvLoading(true);
    fetch('/api/movies/tv/popular')
      .then((res) => res.json())
      .then((data) => setPopularTv(data?.results ?? []))
      .catch(() => setPopularTv([]))
      .finally(() => setPopularTvLoading(false));
  }, []);

  useEffect(() => {
    setOnTheAirLoading(true);
    fetch('/api/movies/tv/on-the-air')
      .then((res) => res.json())
      .then((data) => setOnTheAir(data?.results ?? []))
      .catch(() => setOnTheAir([]))
      .finally(() => setOnTheAirLoading(false));
  }, []);

  return (
    <div className="w-full min-h-screen bg-background overflow-x-hidden text-foreground">
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 min-w-0 lg:ml-64">
          <MoviesHeader onMenuClick={() => setSidebarOpen(true)} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">
                Get a Movie or Series Recap
              </h1>
              <p className="text-muted-foreground mt-1">
                Search or pick a title to refresh your memory
              </p>
            </header>

            <div className="relative mb-10">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search movies or TV shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-xl bg-white/5 border-white/10 text-base placeholder:text-muted-foreground focus-visible:ring-primary-500"
                autoComplete="off"
              />
            </div>

            {searchQuery.trim() && (
              <section className="mb-10">
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  Search results
                </h2>
                {searchLoading ? (
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <RecapMediaCardSkeleton key={i} />
                    ))}
                  </div>
                ) : searchResults.length === 0 ? (
                  <p className="text-muted-foreground">No results found.</p>
                ) : (
                  <div className="flex flex-wrap gap-4">
                    {searchResults.map((item) => (
                      <RecapMediaCard
                        key={`${item.media_type}-${item.id}`}
                        item={item}
                        onClick={() => handleSelect(item)}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

            {!searchQuery.trim() && (
              <div className="space-y-10">
                <QuickPickRow
                  title="Trending Now"
                  items={trendingAll}
                  loading={trendingAllLoading}
                  onSelect={handleSelect}
                />
                <QuickPickRow
                  title="Popular TV"
                  items={popularTv}
                  loading={popularTvLoading}
                  onSelect={handleSelect}
                />
                <QuickPickRow
                  title="Currently Airing TV"
                  items={onTheAir}
                  loading={onTheAirLoading}
                  onSelect={handleSelect}
                />
              </div>
            )}

            {!searchQuery.trim() && (
              <section className="mt-12 pt-8 border-t border-white/5">
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  From your activity
                </h2>
                <p className="text-sm text-muted-foreground">
                  When you&apos;re signed in, we&apos;ll show your watchlist and recent picks here.
                </p>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
