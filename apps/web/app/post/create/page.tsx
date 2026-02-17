'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/movies/Sidebar';
import { MoviesHeader } from '@/components/movies/MoviesHeader';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/shared/ui/button';
import { Label } from '@/components/shared/ui/label';
import { Input } from '@/components/shared/ui/input';
import { Textarea } from '@/components/shared/ui/textarea';
import { RecapMediaCard, type RecapMediaCardItem } from '@/components/catch-up/RecapMediaCard';
import { RecapMediaCardSkeleton } from '@/components/catch-up/RecapMediaCardSkeleton';
import { Film, Tv, X } from 'lucide-react';

export default function CreatePostPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<RecapMediaCardItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{
    itemType: 'movie' | 'series';
    itemId: number;
    title: string;
  } | null>(null);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MAX_TAGS = 3;

  const addTag = () => {
    const value = tagInput.trim();
    if (!value || tags.length >= MAX_TAGS) return;
    if (tags.includes(value)) return;
    setTags((prev) => [...prev, value]);
    setTagInput('');
  };

  const removeTag = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.replace('/sign-in?callbackUrl=/post/create');
    }
  }, [session, isPending, router]);

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
        .then((data) => {
          const results = (data?.results ?? []).filter(
            (r: RecapMediaCardItem) => r.media_type === 'movie' || r.media_type === 'tv'
          ) as RecapMediaCardItem[];
          setSearchResults(results);
        })
        .catch(() => setSearchResults([]))
        .finally(() => setSearchLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const handleSelectMedia = useCallback((item: RecapMediaCardItem) => {
    if (item.media_type === 'person') return;
    const title = item.title ?? item.name ?? 'Unknown';
    setSelectedMedia({
      itemType: item.media_type === 'tv' ? 'series' : 'movie',
      itemId: item.id,
      title,
    });
    setSearchQuery(title);
    setSearchResults([]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selectedMedia || !content.trim()) {
      setError('Please select a movie or series and enter your post content.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim(),
          itemType: selectedMedia.itemType,
          itemId: selectedMedia.itemId,
          tags: tags.slice(0, MAX_TAGS),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data?.code === 'UNAUTHORIZED') {
          router.replace('/sign-in?callbackUrl=/post/create');
          return;
        }
        throw new Error(data?.error ?? 'Failed to create post');
      }
      router.push('/movies');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  if (isPending || !session) {
    return (
      <div className="w-full min-h-screen bg-background overflow-x-hidden text-foreground">
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 min-w-0 lg:ml-64">
            <MoviesHeader onMenuClick={() => setSidebarOpen(true)} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 flex justify-center">
              <p className="text-muted-foreground">Loading…</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background overflow-x-hidden text-foreground">
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 min-w-0 lg:ml-64">
          <MoviesHeader onMenuClick={() => setSidebarOpen(true)} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Create a post</h1>
              <p className="text-muted-foreground mt-1">
                Choose a movie or series and share your thoughts
              </p>
            </header>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl">
          <div>
            <Label htmlFor="media-search">Movie or series</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Search and select the movie or series this post is about.
            </p>
            <Input
              id="media-search"
              type="text"
              placeholder="Search movies or series…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-1"
            />
            {selectedMedia && (
              <div className="mt-3 flex items-center gap-2 p-3 rounded-lg bg-muted/50 text-sm">
                {selectedMedia.itemType === 'series' ? (
                  <Tv className="h-4 w-4 text-primary-500" />
                ) : (
                  <Film className="h-4 w-4 text-primary-500" />
                )}
                <span className="font-medium">{selectedMedia.title}</span>
                <span className="text-muted-foreground">
                  ({selectedMedia.itemType})
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-auto"
                  onClick={() => {
                    setSelectedMedia(null);
                    setSearchQuery('');
                  }}
                >
                  Change
                </Button>
              </div>
            )}
            {searchQuery.trim() && !selectedMedia && (
              <div className="mt-3">
                {searchLoading ? (
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <RecapMediaCardSkeleton key={i} />
                    ))}
                  </div>
                ) : searchResults.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No results found.</p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {searchResults.map((item) => (
                      <RecapMediaCard
                        key={`${item.media_type}-${item.id}`}
                        item={item}
                        onClick={() => handleSelectMedia(item)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="tags">Tags (optional, max {MAX_TAGS})</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Add up to {MAX_TAGS} short tags so others can find your post (e.g. Analysis, Philosophy).
            </p>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, i) => (
                  <span
                    key={`${tag}-${i}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-muted/80 text-foreground border border-border"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(i)}
                      className="rounded-full p-0.5 hover:bg-muted transition-colors"
                      aria-label={`Remove tag ${tag}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {tags.length < MAX_TAGS && (
              <div className="flex gap-2">
                <Input
                  id="tags"
                  type="text"
                  placeholder="e.g. Analysis, Directing"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={addTag} disabled={!tagInput.trim()}>
                  Add
                </Button>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="post-content">Post content</Label>
            <Textarea
              id="post-content"
              placeholder="What do you want to share about this movie or series?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              required
              className="mt-1 resize-y"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" disabled={submitting || !selectedMedia || !content.trim()}>
            {submitting ? 'Submitting…' : 'Submit'}
          </Button>
        </form>
          </div>
        </main>
      </div>
    </div>
  );
}
