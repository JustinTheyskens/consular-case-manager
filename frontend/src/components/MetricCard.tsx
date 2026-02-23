import { Card, CardContent, Typography, Box } from "@mui/material";
import type { ReactNode } from "react";

interface MetricCardProps {
    label: string;
    value?: number | string;
    icon?: ReactNode;
    onClick?: () => void
}

export const MetricCard = ({ label, value, icon, onClick }: MetricCardProps) => {
    const color = '#000080'
    return (
        <Card elevation={1}
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
            <CardContent>
                <Box
                    sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                    <Box>
                        <Typography
                            variant="h2"
                            sx={{ fontWeight: 600 }}
                        >
                            {value}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {label}
                        </Typography>
                    </Box>

                    {icon && (
                        <Box
                            sx={{
                                color: "primary.main",
                                fontSize: 32,
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            {icon}
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};
