'use client';
import LeftNavBar from "@/components/nav/LeftNavBar";
import BottomNavBar from "@/components/nav/BottomNavBar";
import { TopAppBar } from "@/components/nav/Topbar";
import DashboardSummary from "@/components/dashboard/SummaryWidget";
import { SetStateAction, useState,useEffect } from "react";
import ListItem from "@/components/ui/ListItem";

export default function Home() {
  
// const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const [currentPageTitle, setCurrentPageTitle] = useState('Overview');
const [isMobileView, setIsMobileView] = useState(false);
const [isHoverOpen, setIsHoverOpen] = useState(false);
const [isPinned, setIsPinned] = useState(true);
const isSidebarOpen = isPinned || isHoverOpen;
  useEffect(() => {
    const handleResize = () => {
  
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener('resize', handleResize);


    return () => window.removeEventListener('resize', handleResize);
  }, []);


  
  // const toggleSidebar = () => {
  //   setIsSidebarOpen(!isSidebarOpen);
  // };
  const togglePin = () => {
    setIsPinned(prev => !prev);
  };
  const handleNavItemClick = (title: SetStateAction<string>) => {
    setCurrentPageTitle(title);
  };
  const renderActivePage = () => {
      switch (currentPageTitle) {
          case 'Overview':
              return <DashboardSummary />;
          case 'Calendar':
              return "calender";
          case 'Cards':
              return "Cards";
          case 'Budget':
              return "Budget";
          case 'Preferences':
              return "Preferences";
          default:
              return "Overview"; 
      }
  };

  return (
    <div className="bg-neutral-white dark:bg-secondary-darkBrand min-h-screen ">
      {!isMobileView && (
        <div
          onMouseEnter={() => setIsHoverOpen(true)}
          className="fixed top-0 left-0 z-50 h-full w-4"
        />
      )}

      <LeftNavBar 
        isOpen={isSidebarOpen} 
        onNavItemClick={handleNavItemClick} 
        activeItem={currentPageTitle} 
        onMouseLeave={() => setIsHoverOpen(false)}
      />
      <div className={`relative transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
        <TopAppBar 
          variant={isMobileView ? 'back' : 'default'} 
          title={currentPageTitle}
          onToggleSidebar={togglePin} 
          isSidebarOpen={isSidebarOpen} 
        />
        <main className="pt-16">
         {renderActivePage()}
        </main>
      </div>
      <BottomNavBar onNavItemClick={handleNavItemClick} activeItem={currentPageTitle} />
    </div>
  );
}


