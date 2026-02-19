import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
    palette: {
        primary: {
            main: '#1f3a5f', // deep navy blue
        },
        secondary: {
            main: '#6c757d', // muted gray
        },
        background: {
            default: '#f4f6f8',
            paper: '#ffffff',
        },
        error: {
            main: '#b00020',
        }
    },
    shape: {
        borderRadius: 6
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',

        h1: {
            fontSize: '2rem',
            fontWeight: 600,
            lineHeight: 1.3,
        },
        h2: {
            fontSize: '1.5rem',
            fontWeight: 600,
        },
        h3: {
            fontSize: '1.25rem',
            fontWeight: 600,
        },

        body1: {
            fontSize: '0.95rem',
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.85rem',
            color: '#4b5563',
        },

        button: {
            textTransform: 'none',
            fontWeight: 500,
        },
    }
})