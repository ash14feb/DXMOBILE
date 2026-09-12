import React, { useState } from 'react';
import { api } from '../api/client';
import { Smartphone, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginScreen({ onOtpSent }: { onOtpSent: (phone: string) => void; key?: React.Key }) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.sendOtp(phone);
      onOtpSent(phone);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-transparent text-white relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm backdrop-blur-md bg-black/40 p-8 rounded-3xl border border-white/10 shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="w-32 h-32 mx-auto mb-4 drop-shadow-[0_0_20px_rgba(147,51,234,0.5)]">
            <img src="https://i.ibb.co/BHZMPsxc/Logo-Recovered500.png" alt="DimensionX" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
          <p className="text-zinc-400">Enter your phone number to login or register</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Smartphone className="h-5 w-5 text-zinc-500" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter 10 digit number"
                className="w-full pl-11 pr-4 py-3 bg-zinc-900/80 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-white placeholder:text-zinc-600"
              />
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? 'Sending OTP...' : 'Continue'}
            {!loading && <ChevronRight className="h-5 w-5" />}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
