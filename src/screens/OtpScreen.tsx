import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';

export default function OtpScreen({ phone, onBack }: { phone: string, onBack: () => void; key?: React.Key }) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      setError('Please enter the full OTP');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(phone, otp);
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-6 bg-[#09090b] text-white">
      <button 
        onClick={onBack}
        className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center mb-8 hover:bg-zinc-800 transition-colors"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-sm mx-auto"
      >
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Verify Phone</h1>
          <p className="text-zinc-400">
            We sent a verification code to <br/>
            <span className="text-white font-medium">{phone}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Enter OTP (Hint: 1234)</label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              className="w-full px-4 py-4 bg-zinc-900 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-white text-center text-2xl tracking-widest placeholder:text-zinc-700"
            />
            {error && <p className="mt-2 text-sm text-red-500 text-center">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white font-semibold py-3.5 rounded-xl hover:bg-purple-700 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify & Proceed'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
