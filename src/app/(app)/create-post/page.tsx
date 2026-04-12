'use client';

import dynamic from 'next/dynamic';

const CreatePostContent = dynamic(() => import('./CreatePostContent'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/10"></div>
    </div>
  )
});

export default function CreatePostPage() {
  return <CreatePostContent />;
}
