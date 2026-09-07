import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    IconButton,
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Skeleton,
    Chip,
    Button,
} from '@mui/material';
import { ArrowBack, SportsEsports, CalendarToday } from '@mui/icons-material';
import { api } from '../services/api';
import { BillingRecord } from '../types';

interface TransactionsScreenProps {
    rfid: string;
    onBack: () => void;
}

const TransactionsScreen: React.FC<TransactionsScreenProps> = ({ rfid, onBack }) => {
    const [records, setRecords] = useState<BillingRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const limit = 20;

    useEffect(() => {
        fetchRecords();
    }, [rfid]);

    const fetchRecords = async (reset = true) => {
        setLoading(true);
        try {
            const offset = reset ? 0 : page * limit;
            const res = await api.get(`/billing/history/${rfid}?limit=${limit}&offset=${offset}`);
            if (reset) {
                setRecords(res.data.records);
                setPage(1);
            } else {
                setRecords(prev => [...prev, ...res.data.records]);
                setPage(prev => prev + 1);
            }
            setHasMore(res.data.records.length === limit);
        } catch (err) {
            console.error('Failed to fetch transactions');
        } finally {
            setLoading(false);
        }
    };

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const grouped = records.reduce((acc, record) => {
        const date = new Date(record.created_at).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        if (!acc[date]) acc[date] = [];
        acc[date].push(record);
        return acc;
    }, {} as Record<string, BillingRecord[]>);

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
            {/* Header */}
            <Box sx={{ px: 3.5, pt: 4, pb: 3, bgcolor: 'background.paper', borderBottom: '1px solid #F3F4F6' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                    <IconButton
                        onClick={onBack}
                        sx={{
                            bgcolor: '#F9FAFB',
                            border: '1px solid #E5E7EB',
                            width: 48,
                            height: 48,
                            '&:hover': { bgcolor: '#F3F4F6' },
                        }}
                    >
                        <ArrowBack sx={{ color: 'text.secondary' }} />
                    </IconButton>
                    <Box>
                        <Typography variant="h6" color="text.primary">Transactions</Typography>
                        <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mt: 0.25 }}>
                            Billing history for this card
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1, overflowY: 'auto', px: 3.5, pt: 3, pb: 12 }}>
                {loading && records.length === 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {[1, 2, 3, 4, 5].map(i => (
                            <Card key={i}>
                                <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Skeleton variant="rounded" width={48} height={48} sx={{ borderRadius: '14px' }} />
                                    <Box sx={{ flex: 1 }}>
                                        <Skeleton variant="text" width="40%" sx={{ fontSize: 14 }} />
                                        <Skeleton variant="text" width="25%" sx={{ fontSize: 12 }} />
                                    </Box>
                                    <Skeleton variant="text" width={60} sx={{ fontSize: 14 }} />
                                </Box>
                            </Card>
                        ))}
                    </Box>
                ) : records.length === 0 ? (
                    <Card sx={{ textAlign: 'center', py: 6 }}>
                        <CardContent>
                            <Avatar sx={{ width: 64, height: 64, borderRadius: '20px', bgcolor: '#F3F4F6', mx: 'auto', mb: 2 }}>
                                <SportsEsports sx={{ fontSize: 30, color: '#D1D5DB' }} />
                            </Avatar>
                            <Typography variant="body1" color="text.secondary" fontWeight={600}>
                                No transactions found
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Play some games to see history
                            </Typography>
                        </CardContent>
                    </Card>
                ) : (
                    Object.entries(grouped).map(([date, dayRecords]) => (
                        <Box key={date} sx={{ mb: 3.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, ml: 1 }}>
                                <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                                    {date}
                                </Typography>
                            </Box>
                            <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                {dayRecords.map((record) => (
                                    <ListItem
                                        key={record.id}
                                        disablePadding
                                        sx={{
                                            bgcolor: 'background.paper',
                                            borderRadius: '16px',
                                            border: '1px solid rgba(0,0,0,0.04)',
                                            p: 0,
                                        }}
                                    >
                                        <ListItemAvatar sx={{ pl: 2.5, py: 2.5 }}>
                                            <Avatar sx={{ width: 48, height: 48, borderRadius: '14px', bgcolor: '#F0FDFA' }}>
                                                <SportsEsports sx={{ color: '#14B8A6' }} />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography variant="subtitle2" fontWeight={700} noWrap>
                                                    {record.log_game || 'Game Session'}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mt: 0.25, display: 'block' }}>
                                                    {new Date(record.created_at).toLocaleTimeString('en-IN', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </Typography>
                                            }
                                            sx={{ my: 0, minWidth: 0, flex: 1 }}
                                        />
                                        <Box sx={{ pr: 2.5, textAlign: 'right', flexShrink: 0 }}>
                                            <Typography
                                                variant="subtitle2"
                                                fontWeight={800}
                                                sx={{ color: record.is_refund === 'YES' ? '#10B981' : '#EF4444' }}
                                            >
                                                {record.is_refund === 'YES' ? '+' : '-'}{formatAmount(record.amount)}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ mt: 0.25, display: 'block' }}>
                                                Bal: {formatAmount(record.post_amount)}
                                            </Typography>
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    ))
                )}

                {hasMore && records.length > 0 && (
                    <Button
                        fullWidth
                        onClick={() => fetchRecords(false)}
                        disabled={loading}
                        sx={{
                            mt: 2,
                            color: 'primary.main',
                            fontWeight: 700,
                            fontSize: 14,
                            '&:hover': { bgcolor: '#F5F3FF' },
                        }}
                    >
                        {loading ? 'Loading...' : 'Load More'}
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default TransactionsScreen;
