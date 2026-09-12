import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginScreen from './screens/LoginScreen';
import OtpScreen from './screens/OtpScreen';
import HomeScreen from './screens/HomeScreen';
import PlaysScreen from './screens/PlaysScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import RechargesScreen from './screens/RechargesScreen';
import OffersScreen from './screens/OffersScreen';
import BottomNav, { Tab } from './components/BottomNav';
import Header from './components/Header';
import { motion, AnimatePresence } from 'motion/react';

const SmokeCircle = ({ color, initialX, initialY, delay, duration }: { color: string, initialX: string, initialY: string, delay: number, duration: number }) => (
  <motion.div
    className={`absolute rounded-full blur-[100px] mix-blend-screen w-[250px] h-[250px] ${color}`}
    style={{ left: initialX, top: initialY }}
    animate={{
      x: [0, 80, -60, 0],
      y: [0, -70, 80, 0],
      scale: [1, 1.4, 0.9, 1],
      opacity: [0.6, 1, 0.6]
    }}
    transition={{
      duration: duration,
      delay: delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);

const AnimatedSmokeBackground = ({ opacity = 0.8 }: { opacity?: number }) => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" style={{ opacity }}>
     <SmokeCircle color="bg-violet-600" initialX="-10%" initialY="-10%" delay={0} duration={6} />
     <SmokeCircle color="bg-indigo-600" initialX="60%" initialY="10%" delay={0.5} duration={7} />
     <SmokeCircle color="bg-blue-600" initialX="-5%" initialY="60%" delay={1} duration={6.5} />
     <SmokeCircle color="bg-green-600" initialX="40%" initialY="40%" delay={0.2} duration={8} />
     <SmokeCircle color="bg-yellow-500" initialX="70%" initialY="70%" delay={0.8} duration={5.5} />
     <SmokeCircle color="bg-orange-500" initialX="20%" initialY="20%" delay={1.2} duration={6.5} />
     <SmokeCircle color="bg-red-600" initialX="40%" initialY="-5%" delay={1.5} duration={7} />
  </div>
);

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [authStep, setAuthStep] = useState<'login' | 'otp'>('login');
  const [phone, setPhone] = useState('');
  const [currentTab, setCurrentTab] = useState<Tab>('home');

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090b]">
        <div className="w-12 h-12 rounded-full border-4 border-purple-600/30 border-t-purple-600 animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-[#09090b]">
        {/* VIBGYOR Smoke Background for Login */}
        <AnimatedSmokeBackground opacity={1} />
        
        <AnimatePresence mode="wait">
          {authStep === 'login' ? (
            <LoginScreen 
              key="login"
              onOtpSent={(p) => { setPhone(p); setAuthStep('otp'); }} 
            />
          ) : (
            <OtpScreen 
              key="otp"
              phone={phone} 
              onBack={() => setAuthStep('login')} 
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#09090b] text-white overflow-hidden w-full max-w-md mx-auto relative shadow-2xl z-10">
      
      {/* Subtle VIBGYOR Smoke Background for App */}
      <AnimatedSmokeBackground opacity={0.6} />

      <Header />
      
      <main className="flex-1 overflow-hidden flex flex-col z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col h-full"
          >
            {currentTab === 'home' && <HomeScreen onNavigate={setCurrentTab} />}
            {currentTab === 'plays' && <PlaysScreen />}
            {currentTab === 'transactions' && <TransactionsScreen />}
            {currentTab === 'recharges' && <RechargesScreen />}
            {currentTab === 'offers' && <OffersScreen />}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-black flex justify-center w-full">
        <AppContent />
      </div>
    </AuthProvider>
  );
}
