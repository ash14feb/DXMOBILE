import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api/client';
import { BillingRecord } from '../types';
import { RefreshCcw, Coins, Sparkles, Activity, Gamepad2, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { timeAgo } from '../lib/utils';

const BANNERS = [
  "https://i.ibb.co/x8f7rJpY/Chat-GPT-Image-Sep-7-2026-10-35-26-PM.png",
  "https://i.ibb.co/jPQJpFPS/Chat-GPT-Image-Sep-7-2026-10-37-59-PM.png"
];

export default function HomeScreen({ onNavigate }: { onNavigate?: (tab: any) => void }) {
  const { activeCard, refreshBalance } = useAuth();
  const [recent, setRecent] = useState<BillingRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    if (activeCard) {
      loadRecent();
    }
  }, [activeCard?.rfid]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleBannerClick = (index: number) => {
    const messages = [
      "Hi DimensionX, I am interested in a Birthday Party package. Could you provide more details?",
      "Hi DimensionX, I am interested in the VIP card. Could you please give me a coupon code?"
    ];
    const text = encodeURIComponent(messages[index]);
    window.open(`https://wa.me/919986439557?text=${text}`, '_blank');
  };

  const loadRecent = async () => {
    if (!activeCard) return;
    setLoading(true);
    try {
      const res = await api.getRecent(activeCard.rfid);
      setRecent(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshBalance();
    await loadRecent();
    setTimeout(() => setRefreshing(false), 500);
  };

  if (!activeCard) return null;

  const totalBalance = (activeCard.balance_main || 0) + (activeCard.balance_bonus || 0);

  return (
    <div className="flex flex-col flex-1 pb-24 overflow-y-auto px-6 space-y-6">
      
      {/* Banner Slider */}
      <div 
        className="relative w-full h-40 rounded-2xl overflow-hidden mt-2 group cursor-pointer"
        onClick={() => handleBannerClick(currentBanner)}
      >
        <AnimatePresence initial={false}>
          <motion.img
            key={currentBanner}
            src={BANNERS[currentBanner]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        
        {/* Banner Indicators */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
          {BANNERS.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${i === currentBanner ? 'w-4 bg-white' : 'w-1.5 bg-white/40'}`} 
            />
          ))}
        </div>
      </div>

      {/* Balance Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-purple-600 to-blue-600 p-1 shadow-2xl shadow-purple-900/20"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative bg-[#09090b]/40 backdrop-blur-xl rounded-[1.8rem] p-6 h-full flex flex-col justify-between overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -right-20 -top-20 w-48 h-48 bg-purple-500 rounded-full blur-[80px] opacity-50" />
          
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span className="text-xs font-medium text-purple-100 uppercase tracking-widest">Active Card</span>
            </div>
            <button 
              onClick={handleRefresh}
              className={`p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors ${refreshing ? 'animate-spin text-purple-300' : 'text-white'}`}
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center space-y-1 mb-2">
            <p className="text-white/60 text-sm font-medium">Total Balance</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white/60 text-purple-300">₹</span>
              <span className="text-6xl font-black tracking-tight text-white">{totalBalance.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mini Offer */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        onClick={() => {
          const text = encodeURIComponent("Hi DimensionX, I want to use the DXDRDN850 coupon code for ₹50 off the Dinosaur Hyperreality experience.");
          window.open(`https://wa.me/919986439557?text=${text}`, '_blank');
        }}
        className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-emerald-500/20 transition-colors"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">₹50 Off</span>
            <p className="text-xs text-emerald-400 font-medium">Valid this week</p>
          </div>
          <p className="text-sm font-bold text-white leading-tight mb-1">Experience Dinosaur Hyperreality</p>
          <div className="flex items-center gap-1.5">
            <p className="text-[10px] text-zinc-400">Code:</p>
            <code className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded">DXDRDN850</code>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 ml-3">
          <Sparkles className="w-5 h-5 text-emerald-400" />
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-4"
      >
        <div 
          onClick={() => onNavigate?.('recharges')}
          className="bg-zinc-900/80 border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform backdrop-blur-sm cursor-pointer hover:bg-zinc-800"
        >
           <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
             <Coins className="w-6 h-6 text-blue-400" />
           </div>
           <span className="font-medium text-sm text-zinc-300">Top Up</span>
        </div>
        <div 
          onClick={() => onNavigate?.('plays')}
          className="bg-zinc-900/80 border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform backdrop-blur-sm cursor-pointer hover:bg-zinc-800"
        >
           <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center">
             <Activity className="w-6 h-6 text-pink-400" />
           </div>
           <span className="font-medium text-sm text-zinc-300">View History</span>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Recent Activity</h3>
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Last 5</span>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="h-16 bg-zinc-900 rounded-2xl"></div>
            ))}
          </div>
        ) : recent.length > 0 ? (
          <div className="space-y-3">
            {recent.map((record) => (
              <div key={record.id} className="bg-zinc-900/50 border border-white/5 p-4 rounded-2xl flex items-center justify-between backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${record.is_refund === 'YES' ? 'bg-green-500/10 text-green-400' : 'bg-purple-500/10 text-purple-400'}`}>
                    {record.is_refund === 'YES' ? <Activity className="w-5 h-5" /> : <Gamepad2 className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-medium text-zinc-200 text-sm">{record.log_game || 'Unknown Game'}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{timeAgo(record.created_at)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${record.is_refund === 'YES' ? 'text-green-400' : 'text-white'}`}>
                    {record.is_refund === 'YES' ? '+' : '-'}{record.amount}
                  </p>
                  {record.token_earn > 0 && (
                    <p className="text-[10px] text-yellow-500 font-medium mt-0.5">+{record.token_earn} tix</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-zinc-500 bg-zinc-900/30 rounded-2xl border border-white/5 border-dashed">
            <Gamepad2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent plays found.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
