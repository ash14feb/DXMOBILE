import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Avatar,
    Skeleton,
    Alert,
    Chip,
} from '@mui/material';
import { Bolt } from '@mui/icons-material';
import { api } from '../services/api';

interface RechargePackage {
    id: number;
    name: number;
    recharge_value: number;
    bonus: number;
}

interface RechargesScreenProps {
    rfid: string;
}

const RechargesScreen: React.FC<RechargesScreenProps> = ({ rfid }) => {
    const [packages, setPackages] = useState<RechargePackage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get('/recharges/packages');
            setPackages(res.data);
        } catch (err: any) {
            setError(err.message || 'Failed to load packages');
        } finally {
            setLoading(false);
        }
    };

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <Box sx={{ height: '100%', overflowY: 'auto', bgcolor: 'background.default', pb: 10 }}>
            {/* Header */}
            <Box sx={{ px: 3.5, pt: 4, pb: 3, bgcolor: 'background.paper' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '14px',
                            bgcolor: '#ECFDF5',
                        }}
                    >
                        <Bolt sx={{ color: '#10B981', fontSize: 26 }} />
                    </Avatar>
                    <Box>
                        <Typography variant="h5" color="text.primary" fontWeight={800}>
                            Recharges
                        </Typography>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            Choose a package to add balance
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Content */}
            <Box sx={{ px: 3.5, mt: 3 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {[1, 2, 3].map((i) => (
                            <Card key={i}>
                                <CardContent sx={{ p: 3 }}>
                                    <Skeleton variant="text" width="40%" height={28} />
                                    <Skeleton variant="text" width="60%" height={40} sx={{ mt: 1 }} />
                                    <Skeleton variant="text" width="30%" height={20} sx={{ mt: 1 }} />
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                ) : packages.length === 0 ? (
                    <Card sx={{ textAlign: 'center', py: 6 }}>
                        <CardContent>
                            <Avatar
                                sx={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: '20px',
                                    bgcolor: '#F3F4F6',
                                    mx: 'auto',
                                    mb: 2,
                                }}
                            >
                                <Bolt sx={{ fontSize: 30, color: '#D1D5DB' }} />
                            </Avatar>
                            <Typography variant="body1" color="text.secondary" fontWeight={600}>
                                No packages available
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Check back later for recharge options
                            </Typography>
                        </CardContent>
                    </Card>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {packages.map((pkg, index) => {
                            const colors = [
                                { bg: '#EEF2FF', border: '#C7D2FE', chip: '#4F46E5', chipBg: '#E0E7FF' },
                                { bg: '#ECFDF5', border: '#A7F3D0', chip: '#059669', chipBg: '#D1FAE5' },
                                { bg: '#FFF7ED', border: '#FED7AA', chip: '#EA580C', chipBg: '#FFEDD5' },
                                { bg: '#FDF2F8', border: '#FBCFE8', chip: '#DB2777', chipBg: '#FCE7F3' },
                                { bg: '#F0FDFA', border: '#99F6E4', chip: '#0D9488', chipBg: '#CCFBF1' },
                                { bg: '#FEFCE8', border: '#FDE68A', chip: '#CA8A04', chipBg: '#FEF9C3' },
                            ];
                            const color = colors[index % colors.length];
                            return (
                                <Card
                                    key={pkg.id}
                                    sx={{
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        bgcolor: color.bg,
                                        border: `1.5px solid ${color.border}`,
                                        '&:hover': {
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                            transform: 'translateY(-2px)',
                                        },
                                    }}
                                >
                                    <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box>
                                                <Typography
                                                    variant="body2"
                                                    sx={{ color: color.chip, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: 11 }}
                                                >
                                                    Recharge Value
                                                </Typography>
                                                <Typography
                                                    variant="h4"
                                                    color="text.primary"
                                                    fontWeight={800}
                                                    sx={{ mt: 0.5, lineHeight: 1 }}
                                                >
                                                    {formatAmount(pkg.name)}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Chip
                                                    label={`Get ${formatAmount(pkg.recharge_value)}`}
                                                    sx={{
                                                        bgcolor: color.chipBg,
                                                        color: color.chip,
                                                        fontWeight: 700,
                                                        fontSize: 13,
                                                        height: 32,
                                                        borderRadius: 2,
                                                    }}
                                                />
                                                {pkg.bonus > 0 && (
                                                    <Typography
                                                        variant="caption"
                                                        sx={{ color: color.chip, fontWeight: 700, display: 'block', mt: 1 }}
                                                    >
                                                        + {formatAmount(pkg.bonus)} bonus
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default RechargesScreen;
