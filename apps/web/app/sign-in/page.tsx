'use client';

import { useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/shared/ui/button';
import Header from '@/components/shared/Header';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/onboarding';

  const handleSignInWithGoogle = () => {
    authClient.signIn.social({
      provider: 'google',
      callbackURL: callbackUrl,
    });
  };

  return (
    <>
      <Header />
      <div className="container-narrow flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <h1 className="text-2xl font-bold text-foreground">Sign in</h1>
        <p className="text-muted-foreground text-center">
          Sign in with Google to create posts, comment, and like.
        </p>
        <Button onClick={handleSignInWithGoogle} size="lg">
          Sign in with Google
        </Button>
      </div>
    </>
  );
}
