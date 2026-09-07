import React from 'react';
import { Box, Typography, Card, CardMedia } from '@mui/material';

const OFFER_IMAGES = [
    'https://i.ibb.co/x8f7rJpY/Chat-GPT-Image-Sep-7-2026-10-35-26-PM.png',
    'https://i.ibb.co/jPQJpFPS/Chat-GPT-Image-Sep-7-2026-10-37-59-PM.png',
];

const OffersScreen: React.FC = () => {
    return (
        <Box sx={{ height: '100%', overflowY: 'auto', bgcolor: 'background.default', pb: 10 }}>
            <Box sx={{ px: 3.5, pt: 4, mb: 3 }}>
                <Typography variant="h5" color="text.primary" fontWeight={800}>
                    Offers
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 500 }}>
                    Exclusive deals and promotions
                </Typography>
            </Box>

            <Box sx={{ px: 3.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {OFFER_IMAGES.map((src, index) => (
                    <Card
                        key={index}
                        sx={{
                            borderRadius: '20px',
                            overflow: 'hidden',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                        }}
                    >
                        <CardMedia
                            component="img"
                            image={src}
                            alt={`Offer ${index + 1}`}
                            sx={{ width: '100%', display: 'block' }}
                        />
                    </Card>
                ))}
            </Box>
        </Box>
    );
};

export default OffersScreen;
