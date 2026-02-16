'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export interface RecapMarkdownProps {
  content: string;
  className?: string;
}

export function RecapMarkdown({ content, className }: RecapMarkdownProps) {
  return (
    <div className={className ?? 'prose prose-invert max-w-none'}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
