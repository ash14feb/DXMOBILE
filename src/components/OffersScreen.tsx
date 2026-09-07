import React from 'react';
import { Box, Typography, Avatar, Card } from '@mui/material';
import { LocalOffer } from '@mui/icons-material';

const OffersScreen: React.FC = () => {
    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', px: 5 }}>
            <Avatar
                sx={{
                    width: 96,
                    height: 96,
                    borderRadius: '28px',
                    bgcolor: '#FFFBEB',
                    mb: 3,
                }}
            >
                <LocalOffer sx={{ fontSize: 44, color: '#F59E0B' }} />
            </Avatar>
            <Typography variant="h5" color="text.primary" gutterBottom textAlign="center">
                Offers
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ maxWidth: 280, fontWeight: 500, lineHeight: 1.6, mb: 4 }}>
                Exclusive deals and promotions curated just for you. Coming soon.
            </Typography>
            <Card sx={{ px: 5, py: 1.5, bgcolor: '#FFFBEB', border: '1px solid #FDE68A' }}>
                <Typography variant="body2" sx={{ color: '#D97706', fontWeight: 700 }}>
                    Coming Soon
                </Typography>
            </Card>
        </Box>
    );
};

export default OffersScreen;
