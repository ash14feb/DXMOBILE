import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
import theme from './theme';
import LoginScreen from './components/LoginScreen';
import OtpScreen from './components/OtpScreen';
import HomeScreen from './components/HomeScreen';
import TransactionsScreen from './components/TransactionsScreen';
import RechargesScreen from './components/RechargesScreen';
import OffersScreen from './components/OffersScreen';
import BottomNav from './components/BottomNav';
import { Customer, Card, Screen } from './types';

const App: React.FC = () => {
    const [authPhone, setAuthPhone] = useState('');
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [cards, setCards] = useState<Card[]>([]);
    const [activeRfid, setActiveRfid] = useState('');
    const [activeScreen, setActiveScreen] = useState<Screen>('home');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedCustomer = localStorage.getItem('mobapp_customer');
        const storedCards = localStorage.getItem('mobapp_cards');
        const token = localStorage.getItem('mobapp_token');

        if (storedCustomer && storedCards && token) {
            const parsedCustomer = JSON.parse(storedCustomer);
            const parsedCards = JSON.parse(storedCards);
            setCustomer(parsedCustomer);
            setCards(parsedCards);
            setActiveRfid(parsedCustomer.rfid);
        }
        setLoading(false);
    }, []);

    const handlePhoneSubmitted = (phone: string) => {
        setAuthPhone(phone);
    };

    const handleVerified = (cust: Customer, cardList: Card[], token: string) => {
        setCustomer(cust);
        setCards(cardList);
        setActiveRfid(cust.rfid);
        setActiveScreen('home');
    };

    const handleCardSwitch = async (newRfid: string) => {
        setActiveRfid(newRfid);
        const switchedCard = cards.find(c => c.rfid === newRfid);
        if (switchedCard && customer) {
            const updatedCustomer = { ...customer, rfid: newRfid };
            setCustomer(updatedCustomer);
            localStorage.setItem('mobapp_customer', JSON.stringify(updatedCustomer));
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('mobapp_token');
        localStorage.removeItem('mobapp_customer');
        localStorage.removeItem('mobapp_cards');
        setCustomer(null);
        setCards([]);
        setActiveRfid('');
        setAuthPhone('');
    };

    if (loading) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.paper' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '24px',
                                background: 'linear-gradient(135deg, #5C6BC0 0%, #7C4DFF 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 12px 32px rgba(92,107,192,0.3)',
                                fontSize: 26,
                                fontWeight: 800,
                                color: '#fff',
                                fontFamily: '"Plus Jakarta Sans", sans-serif',
                            }}
                        >
                            DX
                        </Box>
                        <CircularProgress size={32} sx={{ color: 'primary.main' }} />
                    </Box>
                </Box>
            </ThemeProvider>
        );
    }

    if (!customer) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box sx={{ height: '100vh' }}>
                    {!authPhone ? (
                        <LoginScreen onPhoneSubmitted={handlePhoneSubmitted} />
                    ) : (
                        <OtpScreen
                            phone={authPhone}
                            onVerified={handleVerified}
                            onBack={() => setAuthPhone('')}
                        />
                    )}
                </Box>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    height: '100vh',
                    bgcolor: 'background.default',
                    display: 'flex',
                    flexDirection: 'column',
                    maxWidth: 512,
                    mx: 'auto',
                    position: 'relative',
                    boxShadow: { xs: 'none', sm: '0 0 60px rgba(0,0,0,0.08)' },
                }}
            >
                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                    {activeScreen === 'home' && (
                        <HomeScreen
                            customer={customer}
                            cards={cards}
                            activeRfid={activeRfid}
                            onCardSwitch={handleCardSwitch}
                            onNavigate={setActiveScreen}
                            onLogout={handleLogout}
                        />
                    )}
                    {activeScreen === 'transactions' && (
                        <TransactionsScreen
                            rfid={activeRfid}
                            onBack={() => setActiveScreen('home')}
                        />
                    )}
                    {activeScreen === 'recharges' && <RechargesScreen rfid={activeRfid} />}
                    {activeScreen === 'offers' && <OffersScreen />}
                </Box>
                <BottomNav activeScreen={activeScreen} onNavigate={setActiveScreen} />
            </Box>
        </ThemeProvider>
    );
};

export default App;
