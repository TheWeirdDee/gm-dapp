'use client';

import Sidebar from "@/components/Sidebar";
import AppHeader from "@/components/AppHeader";
import { useState } from "react";
import { Providers } from "@/components/Providers";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Providers>
      <div className="flex flex-col min-h-screen bg-black overflow-x-hidden">
        <AppHeader onMenuClick={() => setIsSidebarOpen(true)} />
        
        <div className="flex flex-1 max-w-[1800px] mx-auto w-full lg:px-6 relative">
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          
          <main className="flex-1 w-full min-h-[calc(100vh-64px)] overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </Providers>
  );
}
