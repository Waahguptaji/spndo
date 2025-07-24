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
        className="absolute top-1 left-4 z-50 bg-primary-dark p-2 rounded-md shadow-md"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      {isOpen && (
        <aside className="w-64 h-screen bg-secondary-darkBrand border-r shadow-md  space-y-6 fixed top-0 left-0 z-40">
          {/* Logo */}
          <div className="flex items-center gap-3 px-4 py-2 font-bold text-xl text-neutral-white mt-12 ">
            <img
              src="/assets/bag-icon.svg"
              alt="Bag"
              width={26}
              height={26}
              className='bg-primary-brand rounded-full flex items-center justify-center shadow-md'
            />
            <span>Spndo</span>
          </div>
          <hr className="border-neutral-white my-4" />


          {/* Navigation */}
          
          <nav className="flex flex-col gap-4 mt-6">
            {navItems.map(({ label, icon: Icon }) => (
                
              <button
                key={label}
                className="flex items-center gap-3 px-4 py-2 text-neutral-white hover:bg-primary-dark rounded-md transition"
              >
                
                <Icon size={20} />
                <span>{label}</span>
             
              </button>
             
            ))}
          </nav>
       
        </aside>
      )}
    </div>
  )
}
