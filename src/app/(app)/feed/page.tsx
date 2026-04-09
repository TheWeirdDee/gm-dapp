'use client';

import dynamic from 'next/dynamic';

const FeedContent = dynamic(() => import('./FeedContent'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent)]"></div>
    </div>
  )
});

export default function FeedPage() {
  return <FeedContent />;
}
