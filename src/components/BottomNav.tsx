import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Home, ReceiptLong, Bolt, LocalOffer } from '@mui/icons-material';
import { Screen } from '../types';

interface BottomNavProps {
    activeScreen: Screen;
    onNavigate: (screen: Screen) => void;
}

const screenToIndex: Record<Screen, number> = {
    home: 0,
    transactions: 1,
    recharges: 2,
    offers: 3,
};

const indexToScreen: Screen[] = ['home', 'transactions', 'recharges', 'offers'];

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, onNavigate }) => {
    return (
        <BottomNavigation
            value={screenToIndex[activeScreen] ?? 0}
            onChange={(_, newValue) => onNavigate(indexToScreen[newValue])}
            showLabels
            sx={{
                position: 'fixed',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                maxWidth: 512,
                zIndex: 1200,
            }}
        >
            <BottomNavigationAction label="Home" icon={<Home />} />
            <BottomNavigationAction label="Games Played" icon={<ReceiptLong />} />
            <BottomNavigationAction label="Recharge" icon={<Bolt />} />
            <BottomNavigationAction label="Offers" icon={<LocalOffer />} />
        </BottomNavigation>
    );
};

export default BottomNav;
