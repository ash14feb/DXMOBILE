import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api/client';
import { RechargeRecord } from '../types';
import { motion } from 'motion/react';
import { CreditCard, DollarSign } from 'lucide-react';
import { cn, timeAgo } from '../lib/utils';

export default function TransactionsScreen() {
  const { activeCard } = useAuth();
  const [history, setHistory] = useState<RechargeRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (activeCard) {
      setHistory([]);
      setPage(0);
      setHasMore(true);
      loadHistory(0);
    }
  }, [activeCard?.rfid]);

  const loadHistory = async (offset: number) => {
    if (!activeCard) return;
    setLoading(true);
    try {
      const limit = 20;
      const res = await api.getRechargeHistory(activeCard.rfid, limit, offset);
      if (offset === 0) {
        setHistory(res.data.records);
      } else {
        setHistory(prev => [...prev, ...res.data.records]);
      }
      setHasMore(res.data.records.length === limit);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextOffset = (page + 1) * 20;
    setPage(page + 1);
    loadHistory(nextOffset);
  };

  return (
    <div className="flex flex-col flex-1 pb-24 overflow-y-auto px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Recharge History</h1>
        <p className="text-sm text-zinc-400">All top-ups for this card</p>
      </div>

      <div className="space-y-3">
        {history.filter(record => !record.payment_mode?.toLowerCase().includes('return')).map((record, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(idx * 0.05, 0.5) }}
            key={record.id} 
            className="bg-zinc-900 border border-white/5 p-4 rounded-2xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500/10">
                <CreditCard className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-white text-sm">Top Up</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-zinc-500">
                    {timeAgo(record.created_at)}
                  </p>
                  <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                  <p className="text-[10px] text-zinc-500 font-medium">
                    {record.payment_mode || 'Cash'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-bold font-mono text-white">
                +₹{record.recharge_amount}
              </p>
              {record.bonus_amount > 0 && (
                <div className="inline-flex items-center gap-1 mt-1 bg-purple-500/10 px-1.5 py-0.5 rounded text-[10px] text-purple-400 font-bold tracking-wider">
                  +{record.bonus_amount} BONUS
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
          </div>
        )}

        {!loading && hasMore && history.length > 0 && (
          <button 
            onClick={loadMore}
            className="w-full py-3 mt-4 text-sm font-medium text-purple-400 bg-purple-500/10 rounded-xl hover:bg-purple-500/20 transition-colors"
          >
            Load More
          </button>
        )}

        {!loading && history.length === 0 && (
          <div className="text-center py-12 text-zinc-500">
            <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No recharge history available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
