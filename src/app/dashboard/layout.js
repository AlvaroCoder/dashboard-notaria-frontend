import { SideBarNavigation } from '@/components/Navigation'
import TopBar from '@/components/Navigation/TopBar'
import React from 'react'

export default function RootLayout({ children }) {
  return (
<section className="w-full min-h-screen flex flex-row bg-white text-[#0C1019]">
  <SideBarNavigation />
  
  <div className="flex-1 flex flex-col min-h-screen max-h-screen overflow-hidden">
    <TopBar />
    
    <main className="flex-1 overflow-y-auto">
      {children}
    </main>
  </div>
</section>
  )
};
