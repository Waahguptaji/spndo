import { useState, useEffect } from 'react';

export function useNavigation() {
  const [isMobileView, setIsMobileView] = useState(false);
  const [isHoverOpen, setIsHoverOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(() => {
    // Persist pin state
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sidebarPinned') === 'true';
    }
    return true;
  });

  const isSidebarOpen = isPinned || isHoverOpen;

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Persist pin state
  useEffect(() => {
    localStorage.setItem('sidebarPinned', isPinned.toString());
  }, [isPinned]);

  const togglePin = () => {
    setIsPinned(prev => !prev);
  };

  const setHoverOpen = (open: boolean) => {
    setIsHoverOpen(open);
  };

  return {
    isMobileView,
    isHoverOpen,
    isPinned,
    isSidebarOpen,
    togglePin,
    setHoverOpen,
  };
}