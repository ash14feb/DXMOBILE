import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#5C6BC0',
            light: '#7E8CDB',
            dark: '#3F4D9E',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#7C4DFF',
            light: '#A47AFF',
            dark: '#5A2DBF',
        },
        background: {
            default: '#F0F2F5',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#1A1D26',
            secondary: '#6B7280',
        },
        error: {
            main: '#EF4444',
            light: '#FEE2E2',
        },
        success: {
            main: '#10B981',
            light: '#D1FAE5',
        },
        warning: {
            main: '#F59E0B',
            light: '#FEF3C7',
        },
    },
    typography: {
        fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif',
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 700,
        h4: {
            fontWeight: 800,
            fontSize: '28px',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
        },
        h5: {
            fontWeight: 700,
            fontSize: '22px',
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
        },
        h6: {
            fontWeight: 700,
            fontSize: '18px',
            lineHeight: 1.3,
        },
        subtitle1: {
            fontWeight: 600,
            fontSize: '16px',
        },
        subtitle2: {
            fontWeight: 600,
            fontSize: '14px',
        },
        body1: {
            fontSize: '15px',
            lineHeight: 1.5,
        },
        body2: {
            fontSize: '13px',
            lineHeight: 1.5,
        },
        caption: {
            fontSize: '12px',
            fontWeight: 500,
        },
        button: {
            fontWeight: 700,
            fontSize: '15px',
            textTransform: 'none',
            letterSpacing: '0.01em',
        },
    },
    shape: {
        borderRadius: 16,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: '#F0F2F5',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 14,
                    padding: '14px 24px',
                    fontSize: '15px',
                    fontWeight: 700,
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
                sizeLarge: {
                    borderRadius: 16,
                    padding: '16px 28px',
                    fontSize: '16px',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
                    border: '1px solid rgba(0,0,0,0.04)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                },
                elevation0: {
                    boxShadow: 'none',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 14,
                        fontSize: '15px',
                        fontWeight: 600,
                        backgroundColor: '#F9FAFB',
                        '& fieldset': {
                            borderColor: '#E5E7EB',
                            borderWidth: 2,
                        },
                        '&:hover fieldset': {
                            borderColor: '#D1D5DB',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#5C6BC0',
                            borderWidth: 2,
                        },
                        '&.Mui-focused': {
                            backgroundColor: '#FFFFFF',
                        },
                    },
                    '& .MuiInputBase-input': {
                        padding: '16px 18px',
                        '&::placeholder': {
                            color: '#C4C8D0',
                            fontWeight: 500,
                        },
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    borderRadius: 14,
                },
            },
        },
        MuiBottomNavigation: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(20px)',
                    borderTop: '1px solid rgba(0,0,0,0.05)',
                    height: 72,
                },
            },
        },
        MuiBottomNavigationAction: {
            styleOverrides: {
                root: {
                    minWidth: 64,
                    padding: '8px 0',
                    '&.Mui-selected': {
                        color: '#5C6BC0',
                    },
                    '& .MuiBottomNavigationAction-label': {
                        fontSize: '11px',
                        fontWeight: 600,
                        marginTop: 4,
                        '&.Mui-selected': {
                            fontSize: '11px',
                            fontWeight: 700,
                        },
                    },
                    '& .MuiSvgIcon-root': {
                        fontSize: 24,
                    },
                },
            },
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    paddingLeft: 20,
                    paddingRight: 20,
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    fontWeight: 600,
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 14,
                    fontWeight: 500,
                },
            },
        },
    },
});

export default theme;
