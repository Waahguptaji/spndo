'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { appNav } from '@/config/nav'

type DesktopSidebarProps = {
  isOpen: boolean;
  onMouseLeave: () => void;
};

export default function DesktopSidebar({ isOpen, onMouseLeave }: DesktopSidebarProps) {
  const pathname = usePathname();

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
          {appNav.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-2 rounded-md transition text-xl
                  ${isActive
                    ? 'bg-primary-dark text-secondary-darkBrand dark:text-neutral-white'
                    : 'text-secondary-darkBrand dark:text-neutral-white hover:bg-primary-dark/60'}
                `}
              >
                {Icon ? <Icon size={20} /> : null}
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
