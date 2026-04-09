'use client';

import dynamic from 'next/dynamic';

const ProfileContent = dynamic(() => import('@/app/(app)/profile/[address]/ProfileContent'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent)]"></div>
    </div>
  )
});

export default function ProfilePage({ params }: { params: Promise<{ address: string }> }) {
  return <ProfileContent params={params} />;
}
