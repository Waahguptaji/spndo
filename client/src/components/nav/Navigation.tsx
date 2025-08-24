'use client';

import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import LeftNavBar from "./LeftNavBar";
import BottomNavBar from "./BottomNavBar";
import { TopAppBar } from "./Topbar";
import { useNavigation } from "@/hooks/useNavigation";
import { titleForPathname } from "@/config/nav";
import ReminderList from "@/app/(app)/reminder/page";
import SetReminder from "@/components/reminder/setReminder";

interface NavigationProps {
  children: ReactNode;
}

const Navigation: React.FC<NavigationProps> = ({ children }) => {
  const pathname = usePathname();
  const { isMobileView, isSidebarOpen, togglePin, setHoverOpen } = useNavigation();
  const currentPageTitle = titleForPathname(pathname);

  // Manage which view to show
  const [activeView, setActiveView] = useState("dashboard");

  // Sidebar click triggers reminder view


  return (
    <div className="bg-neutral-white dark:bg-secondary-darkBrand min-h-screen">
      {/* Sidebar hover trigger for desktop */}
      {!isMobileView && (
        <div
          onMouseEnter={() => setHoverOpen(true)}
          className="fixed top-0 left-0 z-50 h-full w-4"
        />
      )}

      {/* Left Sidebar with reminder handler */}
      <LeftNavBar
        isOpen={isSidebarOpen}
        onMouseLeave={() => setHoverOpen(false)}
   
      />

      <div className={`relative transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
        {/* Top Bar */}
        <TopAppBar
          variant={isMobileView ? 'back' : 'default'}
          title={
            activeView === "dashboard"
              ? currentPageTitle
              : activeView === "reminder"
              ? "Reminder"
              : "Set Reminder"
              
          }
          onToggleSidebar={togglePin}
          isSidebarOpen={isSidebarOpen}
        />
        
        {/* Main Content */}
        <main className="pt-16 p-4">
          {activeView === "dashboard" && children}

          

          
        </main>
      </div>

      {/* Bottom Nav for Mobile */}
      <BottomNavBar />
    </div>
  );
};

export default Navigation;
