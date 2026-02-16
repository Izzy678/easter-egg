import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { LandingPrimaryImageCtaSection } from '@/components/landing';
import { LandingFeatureList } from '@/components/landing';
import { Button } from '@/components/shared/ui/button';
import Link from 'next/link';
import { Film, Heart, Search, BookOpen, Sparkles } from 'lucide-react';

export default function Page() {
  return (
    <>
      <Header className="mb-4" />

      <LandingPrimaryImageCtaSection
        title="Discover Your Next Favorite Movie"
        description="Find the perfect film for your mood, catch up on series you love, and dive deep into the stories that matter."
        imageSrc="/static/images/1.jpg"
        imageAlt="Movie Discovery"
        imagePosition="right"
        imageShadow="hard"
        textPosition="left"
        withBackground={false}
        variant="primary"
        minHeight={350}
      >
        <Button size="xl" asChild>
          <Link href="/movies">Browse Movies</Link>
        </Button>
        <Button size="xl" variant="outlinePrimary" asChild>
          <Link href="/recommendations">Find by Mood</Link>
        </Button>
      </LandingPrimaryImageCtaSection>

      <LandingFeatureList
        id="features"
        title="Everything you need for your movie journey"
        description="Discover, explore, and remember the stories that move you."
        featureItems={[
          {
            title: 'Mood-Based Recommendations',
            description:
              'Not sure what to watch? Tell us how you feel and we\'ll suggest the perfect movie. Whether you\'re in the mood for something happy, dark, romantic, or adventurous, we\'ve got you covered.',
            icon: <Sparkles className="w-8 h-8" />,
          },
          {
            title: 'Series Recaps & Summaries',
            description:
              'New season dropped after a long wait? Get caught up quickly with detailed season recaps and episode summaries. Never forget what happened in your favorite shows.',
            icon: <BookOpen className="w-8 h-8" />,
          },
          {
            title: 'In-Depth Movie Information',
            description:
              'Go beyond the surface with comprehensive movie details, cast information, trivia, and deep dives into the stories you love. Spoilers are clearly marked so you stay in control.',
            icon: <Film className="w-8 h-8" />,
          },
          {
            title: 'Discover & Browse',
            description:
              'Explore movies by genre, mood, decade, or rating. Find trending films, popular picks, and hidden gems. Your next favorite movie is just a click away.',
            icon: <Search className="w-8 h-8" />,
          },
          {
            title: 'Personal Watchlist',
            description:
              'Save movies and series you want to watch later. Track what you\'ve seen and what\'s next on your list. Your personal cinema collection, organized just for you.',
            icon: <Heart className="w-8 h-8" />,
          },
        ]}
        withBackground
        withBackgroundGlow
        variant="primary"
        backgroundGlowVariant="primary"
      />

      <Footer className="mt-8" />
    </>
  );
}
