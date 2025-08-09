'use client';

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import LeftNavBar from "./LeftNavBar";
import BottomNavBar from "./BottomNavBar";
import { TopAppBar } from "./Topbar";
import { useNavigation } from "@/hooks/useNavigation";
import { titleForPathname } from "@/config/nav";

interface NavigationProps {
  children: ReactNode;
}

const Navigation: React.FC<NavigationProps> = ({ children }) => {
  const pathname = usePathname();
  const { isMobileView, isSidebarOpen, togglePin, setHoverOpen } = useNavigation();
  const currentPageTitle = titleForPathname(pathname);


  return (
    <div className="bg-neutral-white dark:bg-secondary-darkBrand min-h-screen">
      {!isMobileView && (
        <div
          onMouseEnter={() => setHoverOpen(true)}
          className="fixed top-0 left-0 z-50 h-full w-4"
        />
      )}

  <LeftNavBar isOpen={isSidebarOpen} onMouseLeave={() => setHoverOpen(false)} />
      
      <div className={`relative transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
        <TopAppBar 
          variant={isMobileView ? 'back' : 'default'} 
          title={currentPageTitle}
          onToggleSidebar={togglePin} 
          isSidebarOpen={isSidebarOpen} 
        />
        
        <main className="pt-16">
          {children}
        </main>
      </div>
      
  <BottomNavBar />
    </div>
  );
};

export default Navigation;