'use client'
import { Home, Calendar, CreditCard, DollarSign, Settings, Plus } from 'lucide-react'
type MobileBottomNavbarProps = {
  onNavItemClick: (title: string) => void;
  activeItem: string;
};
export default function MobileBottomNavbar({ onNavItemClick, activeItem }: MobileBottomNavbarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-between items-center bg-neutral-white dark:bg-secondary-blueLight border-t p-2 md:hidden overflow-hidden">
      <NavIcon icon={Home} label="Overview" onClick={() => onNavItemClick("Overview")} isActive={activeItem === "Overview"} />
      <NavIcon icon={Calendar} label="Calendar" onClick={() => onNavItemClick("Calendar")} isActive={activeItem === "Calendar"} />
      <div className="bg-primary-dark p-3 rounded-full  shadow-md">
        <Plus size={24} color="white" />
      </div>
      <NavIcon icon={CreditCard} label="Cards" onClick={() => onNavItemClick("Cards")} isActive={activeItem === "Cards"} />
      <NavIcon icon={DollarSign} label="Budget" onClick={() => onNavItemClick("Budget")} isActive={activeItem === "Budget"} />
    </div>
  )
}

function NavIcon({ icon: Icon, label, onClick, isActive }: { icon: any; label: string; onClick: () => void; isActive?: boolean }) {
  return (
    <button className={`flex flex-col items-center justify-center dark:text-neutral-white cursor-pointer text-secondary-darkBrand ${isActive ? 'font-bold' : ''}`} onClick={onClick}>
      <Icon size={20} />
      <span className="text-xs">{label}</span>
    </button>
  )
}
