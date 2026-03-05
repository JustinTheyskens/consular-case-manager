import { Box, Card, CardContent, Typography, CardActionArea } from "@mui/material";

export const AppointmentCard = ({
    label,
    icon,
    description,
    color,
    onClick,
}: {
    label: string;
    icon: React.ReactNode;
    description: string;
    color: string;
    onClick?: () => void;
    "data-testid"?: string;
}) => (
    <Card
        elevation={1}
        data-testid={`appointment-card-${label.replace(/\s+/g, "-").toLowerCase()}`}
        sx={{
            height: "100%",
            cursor: "pointer",
            border: "2px solid lightgray",
            transition: "all 0.2s ease",
            "&:hover": {
                borderColor: color,
                boxShadow: `0 4px 20px ${color}33`,
                transform: "scale(1.02)",
            },
        }}
    >
        <CardActionArea
            onClick={onClick}
            sx={{ height: "100%" }}
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
        </CardActionArea>
    </Card>
);
