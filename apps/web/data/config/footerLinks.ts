export const footerLinks: Array<{
  columnName: string;
  links: Array<{
    href: string;
    title: string;
  }>;
}> = [
  {
    columnName: 'Discover',
    links: [
      { href: '/movies', title: 'Browse Movies' },
      { href: '/recommendations', title: 'Mood Recommendations' },
      { href: '/watchlist', title: 'My Watchlist' },
    ],
  },
  {
    columnName: 'Legal',
    links: [
      { href: '/terms', title: 'Terms' },
      { href: '/privacy', title: 'Privacy' },
      { href: '/cookies', title: 'Cookies' },
    ],
  },
];
