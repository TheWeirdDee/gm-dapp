'use client';

import Sidebar from "@/components/Sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 container mx-auto lg:px-6 relative">
      <Sidebar />
      <main className="flex-1 w-full min-h-[calc(100vh-64px)]">
        {children}
      </main>
    </div>
  );
}
