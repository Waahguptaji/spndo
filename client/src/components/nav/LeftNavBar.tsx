'use client'
import { useState } from 'react'
import { Home, Calendar, CreditCard, DollarSign, Settings, Menu, X } from 'lucide-react'

export default function DesktopSidebar() {
  const [isOpen, setIsOpen] = useState(true)

  const navItems = [
    { label: 'Overview', icon: Home },
    { label: 'Calendar', icon: Calendar },
    { label: 'Credit Cards', icon: CreditCard },
    { label: 'Budgets', icon: DollarSign },
    { label: 'Preferences', icon: Settings },
    { label: 'Preferences', icon: Settings },
    { label: 'Preferences', icon: Settings }
  ]

  return (
    <div className="hidden md:flex">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-2 left-4 z-50 bg-primary-dark p-2 rounded-md shadow-md"
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Sidebar with transition */}
      <aside
        className={`
          w-64 h-screen bg-neutral-white dark:bg-secondary-darkBrand border-r shadow-md space-y-6 fixed top-0 left-0 z-40
          transition-all duration-300
          ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'}
        `}
        style={{ transitionProperty: 'transform, opacity' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-2 font-bold text-3xl text-secondary-darkBrand dark:text-neutral-white  text-center ml-12 ">
          <img
            src="/assets/bag-icon.svg"
            alt="Bag"
            width={28}
            height={28}
            className='bg-primary-brand rounded-full flex items-center justify-center shadow-md p-1'
          />
          <span>Spndo</span>
        </div>
        <hr className="border-secondary-darkBrand dark:border-neutral-white h-2" />

        {/* Navigation */}
        <nav className="flex flex-col gap-4 mt-2">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className="flex items-center gap-3 px-4 py-2  text-secondary-darkBrand dark:text-neutral-white hover:bg-primary-dark rounded-md transition"
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </div>
  )
}
