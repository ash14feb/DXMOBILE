import React, { createContext, useContext, useState, useEffect } from 'react';
import { Customer, Card } from '../types';
import { api } from '../api/client';

interface AuthContextType {
  isAuthenticated: boolean;
  customer: Customer | null;
  cards: Card[];
  activeCard: Card | null;
  login: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
  switchCardLocally: (rfid: string) => void;
  refreshBalance: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = api.getToken();
      if (token) {
        try {
          // Initialize customer and cards
          const profileRes = await api.getProfile();
          const cardsRes = await api.getCards();
          setCustomer(profileRes.data);
          setCards(cardsRes.data);
          
          const storedRfid = localStorage.getItem('mobapp_active_rfid');
          const foundCard = cardsRes.data.find(c => c.rfid === storedRfid);
          if (foundCard) {
             setActiveCard(foundCard);
          } else {
             setActiveCard(cardsRes.data[0] || null);
          }
        } catch (err) {
          console.error("Failed to restore session", err);
          api.clearToken();
        }
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const login = async (phone: string, otp: string) => {
    const res = await api.verifyOtp(phone, otp);
    api.setToken(res.data.token);
    setCustomer(res.data.customer);
    setCards(res.data.cards);
    
    // Default to the first card, or the profile card
    const defaultCard = res.data.cards.find(c => c.rfid === res.data.customer.rfid) || res.data.cards[0];
    setActiveCard(defaultCard);
    if (defaultCard) {
      localStorage.setItem('mobapp_active_rfid', defaultCard.rfid);
    }
  };

  const logout = () => {
    api.clearToken();
    setCustomer(null);
    setCards([]);
    setActiveCard(null);
    localStorage.removeItem('mobapp_active_rfid');
  };

  const switchCardLocally = (rfid: string) => {
    const card = cards.find(c => c.rfid === rfid);
    if (card) {
      setActiveCard(card);
      localStorage.setItem('mobapp_active_rfid', rfid);
    }
  };

  const refreshBalance = async () => {
    if (!activeCard) return;
    try {
      const res = await api.getBalance(activeCard.rfid);
      setActiveCard(prev => prev ? { ...prev, balance_main: res.data.balance_main, balance_bonus: res.data.balance_bonus } : prev);
      
      // Update in cards list too
      setCards(prevCards => prevCards.map(c => 
        c.rfid === activeCard.rfid 
          ? { ...c, balance_main: res.data.balance_main, balance_bonus: res.data.balance_bonus }
          : c
      ));
    } catch (err) {
      console.error("Failed to refresh balance", err);
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!customer,
      customer,
      cards,
      activeCard,
      login,
      logout,
      switchCardLocally,
      refreshBalance,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
