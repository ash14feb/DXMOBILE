import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { RechargePackage } from '../types';
import { motion } from 'motion/react';
import { Zap, ChevronRight } from 'lucide-react';

const GRADIENTS = [
  "from-emerald-500 to-teal-600 border-emerald-500/30 text-emerald-400",
  "from-blue-500 to-indigo-600 border-blue-500/30 text-blue-400",
  "from-purple-500 to-fuchsia-600 border-purple-500/30 text-purple-400",
  "from-pink-500 to-rose-600 border-pink-500/30 text-pink-400",
  "from-orange-500 to-red-600 border-orange-500/30 text-orange-400",
  "from-amber-400 to-orange-500 border-amber-500/30 text-amber-400",
];

export default function RechargesScreen() {
  const [packages, setPackages] = useState<RechargePackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const res = await api.getRechargePackages();
      setPackages(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 pb-24 overflow-y-auto px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Top Up</h1>
        <p className="text-sm text-zinc-400">Recharge your active card instantly</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-32 bg-zinc-900 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {packages.map((pkg, idx) => {
            const gradientParts = GRADIENTS[idx % GRADIENTS.length].split(' ');
            const gradientBg = `${gradientParts[0]} ${gradientParts[1]}`;
            const borderColor = gradientParts[2];
            const textColor = gradientParts[3];

            return (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                key={pkg.id}
                className={`relative bg-gradient-to-br ${gradientBg} border border-white/20 rounded-2xl p-4 flex flex-col justify-between overflow-hidden shadow-lg`}
              >
                {pkg.bonus > 0 && (
                  <div className={`absolute top-0 right-0 bg-white/20 text-[10px] font-bold px-2 py-1 rounded-bl-lg text-white shadow-sm backdrop-blur-md`}>
                    +{pkg.bonus} BONUS
                  </div>
                )}
                
                <div className="mt-4 mb-6 relative z-10">
                  <p className="text-xs text-white/80 font-medium mb-1">Pay</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-medium text-white">₹</span>
                    <span className="text-3xl font-black text-white tracking-tight">{pkg.name}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/20 flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-[10px] text-white/80 font-medium uppercase tracking-wider mb-0.5">Get</p>
                    <p className={`font-bold font-mono text-white`}>{pkg.recharge_value} pts</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full bg-white/20 flex items-center justify-center transition-colors`}>
                    <ChevronRight className="w-3 h-3 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
      
      <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-blue-100 mb-1">Instant Recharge</h4>
          <p className="text-xs text-blue-200/70 leading-relaxed">
            Select a package to securely recharge your card using Apple Pay, Google Pay, or Credit Card. Balances reflect immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
