import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    IconButton,
    Avatar,
    Chip,
    Divider,
    Skeleton,
} from '@mui/material';
import {
    Logout,
    Wallet,
    CreditCard,
    Refresh,
    Gamepad,
    ChevronLeft,
    SportsEsports,
} from '@mui/icons-material';
import { api } from '../services/api';
import { Customer, Card as CardType, BillingRecord } from '../types';

interface HomeScreenProps {
    customer: Customer;
    cards: CardType[];
    activeRfid: string;
    onCardSwitch: (rfid: string) => void;
    onNavigate: (screen: 'transactions') => void;
    onLogout: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ customer, cards, activeRfid, onCardSwitch, onNavigate, onLogout }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [recentGames, setRecentGames] = useState<BillingRecord[]>([]);
    const [balance, setBalance] = useState({ balance_main: customer.balance_main, balance_bonus: customer.balance_bonus });
    const [loadingBalance, setLoadingBalance] = useState(false);

    const activeCard = cards.find(c => c.rfid === activeRfid) || cards[0];

    useEffect(() => {
        fetchBalance();
        fetchRecentGames();
    }, [activeRfid]);

    const fetchBalance = async () => {
        setLoadingBalance(true);
        try {
            const res = await api.get(`/customer/balance/${activeRfid}`);
            setBalance(res.data);
        } catch (err) {
            console.error('Failed to fetch balance');
        } finally {
            setLoadingBalance(false);
        }
    };

    const fetchRecentGames = async () => {
        try {
            const res = await api.get(`/billing/recent/${activeRfid}`);
            setRecentGames(res.data);
        } catch (err) {
            console.error('Failed to fetch recent games');
        }
    };

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatTime = (dateStr: string) => {
        const d = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHrs = Math.floor(diffMs / 3600000);
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHrs < 24) return `${diffHrs}h ago`;
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    const getGreeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good Morning';
        if (h < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <Box sx={{ height: '100%', overflowY: 'auto', bgcolor: 'background.default', pb: 10 }}>
            {/* Header */}
            <Box sx={{ px: 3.5, pt: 4, pb: 3, bgcolor: 'background.paper' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                flexShrink: 0,
                                '& img': {
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                },
                            }}
                        >
                            <img
                                src="https://i.ibb.co/BHZMPsxc/Logo-Recovered500.png"
                                alt="Logo"
                            />
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                {getGreeting()},
                            </Typography>
                            <Typography variant="h5" color="text.primary" sx={{ mt: 0.25 }}>
                                {customer.name}
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton
                        onClick={onLogout}
                        sx={{
                            bgcolor: '#F9FAFB',
                            border: '1px solid #E5E7EB',
                            width: 48,
                            height: 48,
                            '&:hover': { bgcolor: '#FEE2E2', borderColor: '#FECACA', color: '#EF4444' },
                        }}
                    >
                        <Logout fontSize="small" />
                    </IconButton>
                </Box>
            </Box>

            {/* Balance Card */}
            <Box sx={{ px: 3.5, mt: 2.5 }}>
                <Card
                    sx={{
                        background: 'linear-gradient(135deg, #5C6BC0 0%, #7C4DFF 100%)',
                        boxShadow: '0 12px 40px rgba(92,107,192,0.3)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: -40,
                            right: -40,
                            width: 180,
                            height: 180,
                            borderRadius: '50%',
                            bgcolor: 'rgba(255,255,255,0.07)',
                        },
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: -30,
                            left: -30,
                            width: 140,
                            height: 140,
                            borderRadius: '50%',
                            bgcolor: 'rgba(255,255,255,0.04)',
                        },
                    }}
                >
                    <CardContent sx={{ p: 3.5, position: 'relative', zIndex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Avatar
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        bgcolor: 'rgba(255,255,255,0.15)',
                                    }}
                                >
                                    <Wallet sx={{ fontSize: 18 }} />
                                </Avatar>
                                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: 13, letterSpacing: '0.03em' }}>
                                    Total Balance
                                </Typography>
                            </Box>
                            <IconButton
                                size="small"
                                onClick={fetchBalance}
                                sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#fff' } }}
                            >
                                <Refresh sx={{ fontSize: 18, animation: loadingBalance ? 'spin 1s linear infinite' : 'none' }} />
                            </IconButton>
                        </Box>

                        <Typography sx={{ color: '#fff', fontSize: 40, fontWeight: 800, lineHeight: 1, mb: 0.5 }}>
                            {formatAmount(balance.balance_main + balance.balance_bonus)}
                        </Typography>

                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mt: 2.5, mb: 2 }} />

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CreditCard sx={{ fontSize: 15, color: 'rgba(255,255,255,0.4)' }} />
                            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', fontFamily: 'monospace' }}>
                                {activeRfid.slice(0, 4)} •••• {activeRfid.slice(-4)}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            {/* Card Switcher */}
            {cards.length > 1 && (
                <Box sx={{ px: 3.5, mt: 3.5 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', ml: 1, mb: 1.5, display: 'block' }}>
                        Switch Card
                    </Typography>
                    <Card
                        sx={{ cursor: 'pointer', '&:hover': { borderColor: '#C7D2FE' } }}
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ width: 48, height: 48, borderRadius: '14px', bgcolor: '#EEF2FF' }}>
                                    <CreditCard sx={{ color: 'primary.main' }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle2" color="text.primary">{activeCard?.name}</Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                                        {activeRfid.slice(0, 4)} •••• {activeRfid.slice(-4)}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {showDropdown && (
                                    <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 700, fontSize: 13 }}>
                                        Close
                                    </Typography>
                                )}
                                <Avatar
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        bgcolor: '#F9FAFB',
                                        transition: 'transform 0.2s',
                                        transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                                    }}
                                >
                                    <ChevronLeft sx={{ fontSize: 18, color: 'text.secondary', transform: 'rotate(-90deg)' }} />
                                </Avatar>
                            </Box>
                        </Box>

                        {showDropdown && (
                            <Box>
                                <Divider />
                                {cards.map((card) => (
                                    <Box
                                        key={card.rfid}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onCardSwitch(card.rfid);
                                            setShowDropdown(false);
                                        }}
                                        sx={{
                                            p: 2.5,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            bgcolor: card.rfid === activeRfid ? '#F5F3FF' : 'transparent',
                                            '&:hover': { bgcolor: card.rfid === activeRfid ? '#F5F3FF' : '#F9FAFB' },
                                            cursor: 'pointer',
                                            borderBottom: '1px solid #F3F4F6',
                                            '&:last-child': { borderBottom: 'none' },
                                        }}
                                    >
                                        <Avatar sx={{ width: 48, height: 48, borderRadius: '14px', bgcolor: '#EEF2FF' }}>
                                            <CreditCard sx={{ color: 'primary.main' }} />
                                        </Avatar>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography variant="subtitle2" color="text.primary" noWrap>{card.name}</Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                                                {card.rfid.slice(0, 4)} •••• {card.rfid.slice(-4)}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                                            <Typography variant="subtitle2" color="text.primary" fontWeight={800}>
                                                {formatAmount(card.balance_main)}
                                            </Typography>
                                            {card.rfid === activeRfid && (
                                                <Chip label="Active" size="small" color="primary" sx={{ height: 20, fontSize: 11, fontWeight: 700 }} />
                                            )}
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Card>
                </Box>
            )}

            {/* Recent Activity */}
            <Box sx={{ px: 3.5, mt: 3.5, pb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5, ml: 0.5 }}>
                    <Typography variant="subtitle1" color="text.primary" fontWeight={800}>
                        Recent Activity
                    </Typography>
                    {recentGames.length > 0 && (
                        <Typography
                            variant="body2"
                            sx={{ color: 'primary.main', fontWeight: 700, cursor: 'pointer', '&:hover': { color: 'primary.dark' } }}
                            onClick={() => onNavigate('transactions')}
                        >
                            View All
                        </Typography>
                    )}
                </Box>

                {recentGames.length === 0 ? (
                    <Card sx={{ textAlign: 'center', py: 6 }}>
                        <CardContent>
                            <Avatar sx={{ width: 64, height: 64, borderRadius: '20px', bgcolor: '#F3F4F6', mx: 'auto', mb: 2 }}>
                                <SportsEsports sx={{ fontSize: 30, color: '#D1D5DB' }} />
                            </Avatar>
                            <Typography variant="body1" color="text.secondary" fontWeight={600}>
                                No games played yet
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Your activity will appear here
                            </Typography>
                        </CardContent>
                    </Card>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {recentGames.map((record) => (
                            <Card key={record.id}>
                                <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0, flex: 1 }}>
                                        <Avatar
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: '14px',
                                                bgcolor: '#F0FDFA',
                                                flexShrink: 0,
                                            }}
                                        >
                                            <Gamepad sx={{ color: '#14B8A6' }} />
                                        </Avatar>
                                        <Box sx={{ minWidth: 0 }}>
                                            <Typography variant="subtitle2" color="text.primary" noWrap fontWeight={700}>
                                                {record.log_game || 'Game Session'}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mt: 0.25, display: 'block' }}>
                                                {formatTime(record.created_at)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ textAlign: 'right', flexShrink: 0, ml: 2 }}>
                                        <Typography variant="subtitle2" sx={{ color: '#EF4444', fontWeight: 800 }}>
                                            -{formatAmount(record.amount)}
                                        </Typography>
                                        {record.is_refund === 'YES' && (
                                            <Chip label="Refund" size="small" color="success" sx={{ height: 18, fontSize: 10, fontWeight: 700, mt: 0.25 }} />
                                        )}
                                    </Box>
                                </Box>
                            </Card>
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default HomeScreen;
