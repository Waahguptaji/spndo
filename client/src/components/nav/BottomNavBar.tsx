'use client'
import { Home, Calendar, CreditCard, DollarSign, Settings, Plus } from 'lucide-react'

export default function MobileBottomNavbar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-between items-center bg-neutral-whhite dark:bg-secondary-blueLight border-t p-2 md:hidden">
      <NavIcon icon={Home} label="Home" />
      <NavIcon icon={Calendar} label="Calendar" />
      <div className="bg-primary-dark p-3 rounded-full -mt-6 shadow-md">
        <Plus size={24} color="white" />
      </div>
      <NavIcon icon={CreditCard} label="Cards" />
      <NavIcon icon={DollarSign} label="Budget" />
    </div>
  )
}

function NavIcon({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <button className="flex flex-col items-center justify-center  text-neutral-white  cursor-pointer " >
      <Icon size={20} />
      <span className="text-xs">{label}</span>
    </button>
  )
}
