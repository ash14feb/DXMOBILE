import React from 'react';
import { Home, Gamepad2, CreditCard, TicketPercent, IndianRupee } from 'lucide-react';
import { cn } from '../lib/utils';

export type Tab = 'home' | 'plays' | 'transactions' | 'recharges' | 'offers';

interface BottomNavProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function BottomNav({ currentTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'plays', label: 'Plays', icon: Gamepad2 },
    { id: 'transactions', label: 'History', icon: IndianRupee },
    { id: 'recharges', label: 'Recharge', icon: CreditCard },
    { id: 'offers', label: 'Offers', icon: TicketPercent },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#09090b]/80 backdrop-blur-xl border-t border-white/5 pb-safe z-50">
      <div className="flex items-center justify-around px-1 py-3">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = currentTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={cn(
                "flex flex-col items-center justify-center w-14 gap-1 transition-colors duration-200",
                isActive ? "text-purple-400" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-all duration-300",
                isActive ? "bg-purple-500/10" : ""
              )}>
                <Icon className={cn("w-5 h-5", isActive ? "stroke-[2.5px]" : "stroke-2")} />
              </div>
              <span className={cn(
                "text-[9px] font-medium tracking-tight",
                isActive ? "text-purple-400" : "text-zinc-500"
              )}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
