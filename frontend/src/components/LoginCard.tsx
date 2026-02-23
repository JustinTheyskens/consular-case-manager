import { Card, CardContent, Typography, Box } from "@mui/material";
import type { ReactNode } from "react";

interface LoginCardProps {
    label: string;
    icon?: ReactNode;
    onClick?: () => void;
}

export const LoginCard = ({ label, icon, onClick }: LoginCardProps) => {
    return (
        <Card
            elevation={2}
            onClick={onClick}
            sx={{
                width: "100%",
                height: "100%",
                cursor: onClick ? "pointer" : "default",
                transition: "box-shadow 0.2s ease",
                "&:hover": onClick ? { elevation: 2, boxShadow: 6 } : {},
                border: '2px solid', borderColor: 'secondary.main' 
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