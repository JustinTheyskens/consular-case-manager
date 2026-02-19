import { Card, CardContent, Typography, Box } from "@mui/material";
import type { ReactNode } from "react";

interface MetricCardProps {
    label: string;
    value: number | string;
    icon?: ReactNode;
}

export const MetricCard = ({ label, value, icon }: MetricCardProps) => {
    return (
        <Card elevation={1}>
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
