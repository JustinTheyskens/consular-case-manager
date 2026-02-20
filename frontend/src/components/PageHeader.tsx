import { Box, Typography } from "@mui/material";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
}

export const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
    return (
        <Box
            sx={{
                mb: 4,
                px: 4,
                py: 3,
                backgroundColor: "primary.main",
                color: "primary.contrastText",
            }}
        >
            <Typography variant="h1">{title}</Typography>

            {subtitle && (
                <Typography
                    variant="body2"
                    sx={{ mt: 0.5, color: "primary.contrastText" }}
                >
                    {subtitle}
                </Typography>
            )}
        </Box>
    );
};
