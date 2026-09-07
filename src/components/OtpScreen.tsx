import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Avatar,
    Alert,
    IconButton,
    CircularProgress,
} from '@mui/material';
import { ArrowBack, Shield } from '@mui/icons-material';
import { api, ApiError } from '../services/api';
import { Customer, Card } from '../types';

interface OtpScreenProps {
    phone: string;
    onVerified: (customer: Customer, cards: Card[], token: string) => void;
    onBack: () => void;
}

const OtpScreen: React.FC<OtpScreenProps> = ({ phone, onVerified, onBack }) => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError('');

        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }

        if (newOtp.every(d => d !== '') && newOtp.join('').length === 4) {
            handleVerify(newOtp.join(''));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
        if (pasted) {
            const newOtp = pasted.split('').concat(Array(4).fill('')).slice(0, 4);
            setOtp(newOtp);
            const nextEmpty = newOtp.findIndex(d => d === '');
            inputRefs.current[nextEmpty === -1 ? 3 : nextEmpty]?.focus();
            if (pasted.length === 4) {
                handleVerify(pasted);
            }
        }
    };

    const handleVerify = async (otpValue: string) => {
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/verify-otp', {
                phone,
                otp: otpValue
            });
            localStorage.setItem('mobapp_token', response.data.token);
            localStorage.setItem('mobapp_customer', JSON.stringify(response.data.customer));
            localStorage.setItem('mobapp_cards', JSON.stringify(response.data.cards));
            onVerified(response.data.customer, response.data.cards, response.data.token);
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError('Verification failed. Please try again.');
            }
            setOtp(['', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', bgcolor: '#0a0a1a' }}>
            {/* Smoke blobs */}
            <div style={{ position: 'absolute', top: '10%', left: '-10%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.7) 0%, transparent 70%)', filter: 'blur(80px)', opacity: 0.5, animation: 'smokeMove1 8s ease-in-out infinite', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '50%', left: '60%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.6) 0%, transparent 70%)', filter: 'blur(80px)', opacity: 0.5, animation: 'smokeMove2 10s ease-in-out infinite', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '20%', left: '70%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(20,184,166,0.5) 0%, transparent 70%)', filter: 'blur(80px)', opacity: 0.5, animation: 'smokeMove3 12s ease-in-out infinite', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '60%', left: '-5%', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.5) 0%, transparent 70%)', filter: 'blur(80px)', opacity: 0.5, animation: 'smokeMove4 9s ease-in-out infinite', pointerEvents: 'none' }} />

            <Box sx={{ px: 3, pt: 3, position: 'relative', zIndex: 1 }}>
                <IconButton
                    onClick={onBack}
                    sx={{
                        bgcolor: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        width: 48,
                        height: 48,
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                    }}
                >
                    <ArrowBack sx={{ color: '#fff' }} />
                </IconButton>
            </Box>

            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: 4, position: 'relative', zIndex: 1 }}>
                <Box sx={{ width: '100%', maxWidth: 380 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 6 }}>
                        <Avatar
                            sx={{
                                width: 76,
                                height: 76,
                                borderRadius: '22px',
                                bgcolor: 'rgba(124,77,255,0.2)',
                                mb: 3,
                            }}
                        >
                            <Shield sx={{ fontSize: 36, color: '#A78BFA' }} />
                        </Avatar>
                        <Typography variant="h5" sx={{ color: '#fff', fontWeight: 800 }} gutterBottom>
                            Verification Code
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)' }} fontWeight={500} textAlign="center">
                            Enter the 4-digit code sent to
                        </Typography>
                        <Typography variant="subtitle1" sx={{ color: '#fff' }} fontWeight={700} mt={0.5}>
                            +91 {phone}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2.5, mb: 4 }}>
                        {otp.map((digit, index) => (
                            <TextField
                                key={index}
                                inputRef={(el) => { inputRefs.current[index] = el; }}
                                type="tel"
                                inputProps={{
                                    maxLength: 1,
                                    inputMode: 'numeric',
                                    style: {
                                        textAlign: 'center',
                                        fontSize: '28px',
                                        fontWeight: 700,
                                        padding: 0,
                                        height: '100%',
                                        color: '#fff',
                                    },
                                }}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value.replace(/\D/g, ''))}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                sx={{
                                    width: 64,
                                    height: 72,
                                    '& .MuiOutlinedInput-root': {
                                        height: '100%',
                                        borderRadius: '18px',
                                        backgroundColor: digit ? 'rgba(124,77,255,0.15)' : 'rgba(255,255,255,0.05)',
                                        '& fieldset': {
                                            borderColor: digit ? 'rgba(167,139,250,0.6)' : 'rgba(255,255,255,0.15)',
                                            borderWidth: 2,
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'rgba(255,255,255,0.3)',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#7C4DFF',
                                            borderWidth: 2,
                                        },
                                    },
                                    '& .MuiInputBase-input': {
                                        padding: 0,
                                        textAlign: 'center',
                                        color: '#fff',
                                    },
                                }}
                            />
                        ))}
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2, borderRadius: 3, fontWeight: 500 }}>
                            {error}
                        </Alert>
                    )}

                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                            <CircularProgress size={28} sx={{ color: '#A78BFA' }} />
                        </Box>
                    )}

                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', mt: 5, fontWeight: 500 }}>
                        For demo, use OTP: <Box component="span" sx={{ fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>1234</Box>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default OtpScreen;
