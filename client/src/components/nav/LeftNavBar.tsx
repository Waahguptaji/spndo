'use client'

import { Home, Calendar, CreditCard, DollarSign, Settings, Menu, X } from 'lucide-react'
type DesktopSidebarProps = {
  isOpen: boolean;
  onNavItemClick: (title: string) => void;
  activeItem: string;
  onMouseLeave: () => void;
};
export default function DesktopSidebar({ isOpen, onNavItemClick, activeItem, onMouseLeave }: DesktopSidebarProps) {
  const navItems = [
    { label: 'Overview', icon: Home },
    { label: 'Calendar', icon: Calendar },
    { label: 'Cards', icon: CreditCard },
    { label: 'Budget', icon: DollarSign },
    { label: 'Preferences', icon: Settings },
  ];

  return (
    <div className="hidden md:flex"onMouseLeave={onMouseLeave}>
      {/* The toggle button has been removed from here */}
      <aside
        className={`
         w-64 h-screen bg-neutral-white dark:bg-secondary-darkBrand border-r shadow-md space-y-6 fixed top-0 left-0 z-40
          transition-all duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 font-bold text-3xl text-gray-800 dark:text-white text-center ml-4">
          <img
            src="/assets/bag-icon.svg"
            alt="Bag"
            width={28}
            height={28}
            className='bg-primary-brand rounded-full flex items-center justify-center shadow-md p-1'
          />
          <span>Spndo</span>
        </div>
        <hr className="border-gray-200 dark:border-gray-700 mx-4" />

        {/* Navigation */}
        <nav className="flex flex-col gap-4 p-4 mt-2">
          {navItems.map(({ label, icon: Icon }, index) => {
            const isActive = activeItem === label;
            return (
            <button
              key={label}
              className={`flex items-center gap-3 px-4 py-2  text-secondary-darkBrand dark:text-neutral-white hover:bg-primary-dark rounded-md transition text-xl ${isActive ? 'bg-primary-dark' : ''}`}
              onClick={() => onNavItemClick(label)}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          );
        })}

        </nav>
      </aside>
    </div>
  );
}
