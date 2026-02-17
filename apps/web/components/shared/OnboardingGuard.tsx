'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

type UserWithUsername = { username?: string | null };

/**
 * Redirects signed-in users who have not set a username to /onboarding.
 * Skips redirect on sign-in, onboarding, and API routes.
 */
export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;
    if (!session) return;
    if (pathname === '/sign-in' || pathname === '/onboarding' || pathname.startsWith('/api')) return;

    const user = session.user as UserWithUsername;
    const hasUsername = Boolean(user?.username?.trim());
    if (!hasUsername) {
      const callbackUrl = pathname && pathname !== '/' ? pathname : '/movies';
      router.replace(`/onboarding?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }
  }, [session, isPending, pathname, router]);

  return <>{children}</>;
}
