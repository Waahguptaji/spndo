import { ArrowLeft, Bell, Menu, MoreVertical, Search, X } from "lucide-react";
import { useState } from "react";
import Login from "@/app/login/page";
 
type TopAppBarProps = {
  variant?: 'default' | 'back' | 'search';
  title: string;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
};

export const TopAppBar = ({ variant = 'default', title, onToggleSidebar, isSidebarOpen }: TopAppBarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => console.log('Logging out...');
  const handleHelp = () => console.log('Navigating to Help & Support...');
  const handleBack = () => {return <Login />};
  const handleSearch = () =>  console.log('Opening search...'); 
  

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between px-4 sm:px-6 bg-netral-white dark:bg-secondary-darkBrand text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Left Section: Varies based on the 'variant' prop */}
      <div className="flex items-center gap-4">
        {variant === 'default' && (
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
            className="hidden md:block p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}
        {(variant === 'back' || variant === 'search') && (
          <button
            onClick={handleBack}
            aria-label="Go back"
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>

      {/* Right Section: Varies based on the 'variant' prop */}
      <div className="flex items-center gap-2 sm:gap-4 relative">
        {variant === 'search' && (
          <button
            onClick={handleSearch}
            aria-label="Search"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
        )}

        {variant === 'default' && (
          <>
            <button
              aria-label="Notifications"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Bell className="w-5 h-5" />
            </button>
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="More actions"
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 shadow-xl rounded-lg z-30 ring-1 ring-black ring-opacity-5">
                  <ul>
                    <li>
                      <button
                        onClick={handleHelp}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-t-lg"
                      >
                        Help & Support
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-b-lg"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
};
