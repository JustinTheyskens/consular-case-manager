import { Card, CardContent, Typography, Box } from "@mui/material";
import type { ReactNode } from "react";

interface LoginCardProps {
    label: string;
    icon?: ReactNode;
    onClick?: () => void;
}

export const LoginCard = ({ label, icon, onClick }: LoginCardProps) => {
    const color = '#000080'
    return (
        <Card
            elevation={1}
            onClick={onClick}
            sx={{
                width: "100%",
                height: "100%",
                cursor: onClick ? "pointer" : "default",
                border: "2px solid transparent",
                transition: "box-shadow 0.2s ease",
                "&:hover": {
                borderColor: color,
                boxShadow: `0 4px 20px ${color}33`,
                transform: "scale(1.02)",
            },
            }}
        >
            <CardContent
                sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                }}
            >
                {icon && (
                    <Box sx={{ color: "primary.main", display: "flex" }}>
                        {icon}
                    </Box>
                )}
                <Typography variant="h6" fontWeight={600}>
                    {label}
                </Typography>
            </CardContent>
        </Card>
    );
};