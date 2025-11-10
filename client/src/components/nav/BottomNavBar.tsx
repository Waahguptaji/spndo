"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { bottomNav } from "@/config/nav";
import { Plus } from "lucide-react";

export default function MobileBottomNavbar() {
  const pathname = usePathname();
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-between items-center bg-neutral-white dark:bg-secondary-blueLight border-t p-2 md:hidden overflow-hidden">
      {bottomNav.slice(0, 2).map(({ href, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center ${
              isActive ? "font-bold" : ""
            }`}
          >
            {Icon ? <Icon size={30} /> : null}
            {/* <span className="text-xs">{label}</span> */}
          </Link>
        );
      })}
      <div className="bg-primary-dark p-3 rounded-full  shadow-md">
        <Plus size={24} color="white" />
      </div>
      {bottomNav.slice(2, 4).map(({ href, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center ${
              isActive ? "font-bold" : ""
            }`}
          >
            {Icon ? <Icon size={30} /> : null}
            {/* <span className="text-xs">{label}</span> */}
          </Link>
        );
      })}
    </div>
  );
}
