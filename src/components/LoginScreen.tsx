import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    InputAdornment,
    Alert,
    CircularProgress,
} from '@mui/material';
import { Phone, ArrowForward } from '@mui/icons-material';
import { api, ApiError } from '../services/api';

interface LoginScreenProps {
    onPhoneSubmitted: (phone: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onPhoneSubmitted }) => {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.length < 10) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/send-otp', { phone });
            onPhoneSubmitted(phone);
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const blobStyle = (top: string, left: string, size: string, gradient: string, animation: string, duration: string): React.CSSProperties => ({
        position: 'absolute',
        top,
        left,
        width: size,
        height: size,
        borderRadius: '50%',
        background: gradient,
        filter: 'blur(80px)',
        opacity: 0.5,
        animation: `${animation} ${duration} ease-in-out infinite`,
        willChange: 'transform',
        pointerEvents: 'none',
    });

    return (
        <Box
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: 4,
                    position: 'relative',
                    overflow: 'hidden',
                    bgcolor: '#0a0a1a',
                }}
            >
                {/* Smoke blobs */}
                <div style={blobStyle('10%', '-10%', '350px', 'radial-gradient(circle, rgba(99,102,241,0.7) 0%, transparent 70%)', 'smokeMove1', '8s')} />
                <div style={blobStyle('50%', '60%', '300px', 'radial-gradient(circle, rgba(168,85,247,0.6) 0%, transparent 70%)', 'smokeMove2', '10s')} />
                <div style={blobStyle('20%', '70%', '280px', 'radial-gradient(circle, rgba(20,184,166,0.5) 0%, transparent 70%)', 'smokeMove3', '12s')} />
                <div style={blobStyle('60%', '-5%', '320px', 'radial-gradient(circle, rgba(236,72,153,0.5) 0%, transparent 70%)', 'smokeMove4', '9s')} />
                <div style={blobStyle('75%', '40%', '260px', 'radial-gradient(circle, rgba(249,115,22,0.4) 0%, transparent 70%)', 'smokeMove5', '11s')} />
                <div style={blobStyle('5%', '30%', '200px', 'radial-gradient(circle, rgba(59,130,246,0.5) 0%, transparent 70%)', 'smokeMove3', '7s')} />
                <div style={blobStyle('40%', '10%', '250px', 'radial-gradient(circle, rgba(234,179,8,0.35) 0%, transparent 70%)', 'smokeMove1', '13s')} />

                {/* Content */}
                <Box sx={{ width: '100%', maxWidth: 380, position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 8 }}>
                        <Box
                            sx={{
                                width: 160,
                                height: 160,
                                mb: 3,
                                '& img': {
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    filter: 'drop-shadow(0 0 30px rgba(124,77,255,0.4))',
                                },
                            }}
                        >
                            <img
                                src="https://i.ibb.co/BHZMPsxc/Logo-Recovered500.png"
                                alt="DimensionX Logo"
                            />
                        </Box>
                        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800 }} gutterBottom>
                            Welcome
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)' }} fontWeight={500}>
                            Sign in to continue to DimensionX
                        </Typography>
                    </Box>

                    <form onSubmit={handleSubmit}>
                        <Typography
                            variant="caption"
                            sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', mb: 1.5, display: 'block', ml: 1 }}
                        >
                            Phone Number
                        </Typography>
                        <TextField
                            fullWidth
                            type="tel"
                            value={phone}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                setPhone(val);
                                setError('');
                            }}
                            placeholder="Enter your phone number"
                            autoComplete="tel"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Phone sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 22 }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                mb: 3,
                                '& .MuiOutlinedInput-root': {
                                    color: '#fff',
                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                                    '&.Mui-focused fieldset': { borderColor: '#7C4DFF' },
                                },
                                '& .MuiInputBase-input::placeholder': {
                                    color: 'rgba(255,255,255,0.3)',
                                    opacity: 1,
                                },
                            }}
                        />

                        {error && (
                            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 3, fontWeight: 500 }}>
                                {error}
                            </Alert>
                        )}

                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            type="submit"
                            disabled={loading || phone.length < 10}
                            endIcon={!loading ? <ArrowForward /> : undefined}
                            sx={{
                                py: 2.2,
                                fontSize: '16px',
                                fontWeight: 700,
                                borderRadius: '16px',
                                background: 'linear-gradient(135deg, #5C6BC0 0%, #7C4DFF 100%)',
                                boxShadow: '0 8px 24px rgba(92,107,192,0.35)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #4A5AB5 0%, #6A3DE8 100%)',
                                    boxShadow: '0 12px 32px rgba(92,107,192,0.4)',
                                },
                                '&:disabled': {
                                    background: 'rgba(255,255,255,0.1)',
                                    color: 'rgba(255,255,255,0.3)',
                                    boxShadow: 'none',
                                },
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Continue'}
                        </Button>
                    </form>

                    <Typography
                        variant="body2"
                        sx={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', mt: 5, fontWeight: 500 }}
                    >
                        We'll send you a one-time verification code
                    </Typography>
                </Box>
            </Box>
        </>
    );
};

export default LoginScreen;
