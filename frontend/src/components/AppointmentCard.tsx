import { PageHeader } from "../components/PageHeader";
import { MetricCard } from "../components/MetricCard";
import { theme } from "../theme";

import {
    Box,
    ThemeProvider,
    Card,
    CardContent,
    Typography,
    Button,
    Chip,
    Divider,
} from "@mui/material";

export const AppointmentCard = ({
    label,
    icon,
    description,
    color,
}: {
    label: string;
    icon: React.ReactNode;
    description: string;
    color: string;
}) => (
    <Card
        elevation={1}
        sx={{
            height: "100%",
            cursor: "pointer",
            border: "2px solid transparent",
            transition: "all 0.2s ease",
            "&:hover": {
                borderColor: color,
                boxShadow: `0 4px 20px ${color}33`,
                transform: "scale(1.02)",
            },
        }}
    >
        <CardContent
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                gap: 1,
                py: 3,
            }}
        >
            <Box sx={{ color }}>{icon}</Box>
            <Typography
                variant="subtitle1"
                fontWeight={600}
            >
                {label}
            </Typography>
            <Typography
                variant="body2"
                color="text.secondary"
            >
                {description}
            </Typography>
        </CardContent>
    </Card>
);