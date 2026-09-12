import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Header() {
  const { customer, cards, activeCard, switchCardLocally, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!customer || !activeCard) return null;

  return (
    <header className="px-6 py-4 flex items-center justify-between z-50 relative">
      <div>
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-0.5">Welcome back</p>
        <h2 className="text-lg font-bold text-white uppercase">{customer.name}</h2>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 bg-zinc-900 border border-white/10 rounded-full pl-3 pr-2 py-1.5 hover:bg-zinc-800 transition-colors"
        >
          <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-bold">
            {activeCard.name.charAt(0) || 'C'}
          </div>
          <span className="text-sm font-medium text-white max-w-[80px] truncate">
            {activeCard.name || activeCard.rfid}
          </span>
          <ChevronDown className="w-4 h-4 text-zinc-400" />
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsDropdownOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-64 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-2 z-50 origin-top-right overflow-hidden"
              >
                <div className="px-3 py-2 border-b border-white/5 mb-2">
                  <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Your Cards</p>
                </div>
                
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {cards.map(card => (
                    <button
                      key={card.rfid}
                      onClick={() => {
                        switchCardLocally(card.rfid);
                        setIsDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-colors",
                        card.rfid === activeCard.rfid 
                          ? "bg-purple-500/10 text-purple-400" 
                          : "hover:bg-zinc-800 text-zinc-300"
                      )}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{card.name || 'Unnamed Card'}</span>
                        <span className="text-xs opacity-70 font-mono">{card.rfid}</span>
                      </div>
                      {card.rfid === activeCard.rfid && (
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
