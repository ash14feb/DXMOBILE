import React from 'react';
import { motion } from 'motion/react';
import { Gift, Ticket, Flame } from 'lucide-react';

export default function OffersScreen() {
  const offers = [
    {
      id: 1,
      title: "Weekend Madness",
      desc: "Double bonus points on all recharges above $50. Valid till Sunday midnight.",
      icon: Flame,
      color: "from-orange-500 to-red-500",
      valid: "2 days left"
    },
    {
      id: 2,
      title: "Birthday Treat",
      desc: "Get 500 free tickets on your birthday month. Claim at the counter.",
      icon: Gift,
      color: "from-pink-500 to-purple-500",
      valid: "Valid all month"
    },
    {
      id: 3,
      title: "VR Arena Pass",
      desc: "Play 3 VR games and get the 4th free. Auto-applied to your card.",
      icon: Ticket,
      color: "from-blue-500 to-cyan-500",
      valid: "Ongoing"
    }
  ];

  const handleOfferClick = (title: string) => {
    const text = encodeURIComponent(`Hi DimensionX, I am interested in the ${title} offer. Could you provide more details?`);
    window.open(`https://wa.me/919986439557?text=${text}`, '_blank');
  };

  return (
    <div className="flex flex-col flex-1 pb-24 overflow-y-auto px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Exclusive Offers</h1>
        <p className="text-sm text-zinc-400">Special promotions just for you</p>
      </div>

      <div className="space-y-4">
        {offers.map((offer, idx) => {
          const Icon = offer.icon;
          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={offer.id}
              onClick={() => handleOfferClick(offer.title)}
              className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden cursor-pointer hover:bg-zinc-800 transition-colors"
            >
              <div className={`h-2 w-full bg-gradient-to-r ${offer.color}`}></div>
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br ${offer.color} bg-opacity-10 shrink-0`}>
                    <Icon className="w-6 h-6 text-white drop-shadow-md" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-white">{offer.title}</h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-sm">
                        {offer.valid}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {offer.desc}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
