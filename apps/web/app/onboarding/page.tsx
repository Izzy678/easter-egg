'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/shared/ui/button';
import { Input } from '@/components/shared/ui/input';
import { cn } from '@/lib/utils';

const AVATAR_OPTIONS = [
  { seed: 'Felix', label: 'Avatar 1' },
  { seed: 'Aneka', label: 'Avatar 2' },
  { seed: 'Max', label: 'Avatar 3' },
  { seed: 'Lily', label: 'Avatar 4' },
  { seed: 'Charlie', label: 'Avatar 5' },
  { seed: 'Zoe', label: 'Avatar 6' },
].map((a) => ({
  ...a,
  url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(a.seed)}`,
}));

type UserWithUsername = { username?: string | null; image?: string | null };

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/movies';

  const { data: session, isPending } = authClient.useSession();
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(AVATAR_OPTIONS[0].url);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = session?.user as UserWithUsername | undefined;
  const hasUsername = Boolean(user?.username?.trim());

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      const onboardingReturn = callbackUrl !== '/movies' ? `/onboarding?callbackUrl=${encodeURIComponent(callbackUrl)}` : '/onboarding';
      router.replace(`/sign-in?callbackUrl=${encodeURIComponent(onboardingReturn)}`);
      return;
    }
    if (hasUsername) {
      router.replace(callbackUrl);
    }
  }, [session, isPending, hasUsername, router, callbackUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = username.trim();
    if (!trimmed) {
      setError('Please enter a username.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await authClient.updateUser({
        username: trimmed,
        image: selectedAvatar,
      });
      if (res.error) {
        setError(res.error.message ?? 'Failed to update profile.');
        return;
      }
      router.push(callbackUrl);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isPending || !session || hasUsername) {
    return (
      <div className="container-narrow flex flex-col items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <div className="container-narrow flex flex-col items-center justify-center min-h-screen gap-8 py-12">
        <div className="w-full max-w-sm space-y-6">
          <h1 className="text-2xl font-bold text-foreground text-center">
            Complete your profile
          </h1>
          <p className="text-muted-foreground text-center text-sm">
            Choose a username and avatar. You can change these later.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-foreground">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="e.g. movie_fan"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={32}
                autoComplete="username"
                className="w-full"
                disabled={submitting}
              />
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium text-foreground">Avatar</span>
              <div className="grid grid-cols-3 gap-3">
                {AVATAR_OPTIONS.map((opt) => (
                  <button
                    key={opt.seed}
                    type="button"
                    onClick={() => setSelectedAvatar(opt.url)}
                    className={cn(
                      'relative rounded-full overflow-hidden border-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      selectedAvatar === opt.url
                        ? 'border-primary-500 ring-2 ring-primary-500/30'
                        : 'border-transparent hover:border-muted-foreground/30',
                    )}
                    aria-label={opt.label}
                    aria-pressed={selectedAvatar === opt.url}
                  >
                    <img
                      src={opt.url}
                      alt={opt.label}
                      className="w-full aspect-square object-cover"
                      width={80}
                      height={80}
                    />
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={submitting}>
              {submitting ? 'Saving…' : 'Continue'}
            </Button>
          </form>
        </div>
      </div>
  );
}
