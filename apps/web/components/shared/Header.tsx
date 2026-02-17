import { LandingHeader, LandingHeaderMenuItem } from '@/components/landing';
import ThemeSwitch from '@/components/shared/ThemeSwitch';
import Image from 'next/image';
import Link from 'next/link';
import { Bell, PenSquare } from 'lucide-react';
import { Button } from '@/components/shared/ui/button';

export const Header = ({ className }: { className?: string }) => {
  return (
    <LandingHeader
      className={className}
      fixed
      withBackground
      variant="primary"
      logoComponent={
        <div className="flex items-center text-primary-500 dark:text-primary-500 gap-3">
          <Image
            src="/static/images/logo.png"
            alt="MovieLover logo"
            width={200}
            height={200}
            className="h-8 w-8 rounded-full"
          />
          <span className="font-bold text-lg">MovieLover</span>
        </div>
      }
    >
      <LandingHeaderMenuItem href="/movies">{'Movies'}</LandingHeaderMenuItem>
      <LandingHeaderMenuItem href="/recommendations">
        {'Recommendations'}
      </LandingHeaderMenuItem>
      <LandingHeaderMenuItem href="/watchlist">{'Watchlist'}</LandingHeaderMenuItem>
      <LandingHeaderMenuItem href="/post/create">
        <span className="flex items-center gap-2">
          <PenSquare className="h-4 w-4" />
          Create Post
        </span>
      </LandingHeaderMenuItem>
      <Button variant="ghost" size="icon" className="rounded-full" asChild>
        <Link href="#" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Link>
      </Button>
      <ThemeSwitch />
    </LandingHeader>
  );
};

export default Header;
