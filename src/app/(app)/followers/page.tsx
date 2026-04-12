'use client';

import dynamic from 'next/dynamic';

const FollowersContent = dynamic(() => import('./FollowersContent'), { ssr: false });

export default function FollowersPage() {
  return <FollowersContent />;
}
