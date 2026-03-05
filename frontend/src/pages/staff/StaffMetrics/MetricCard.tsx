// Redone metrics card due to formatting issues with the other one

import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

interface MetricCardProps {
  label: string;
  value: number | string;
  color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, color }) => {
  return (
    <Card
      sx={{
        height: 120,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        borderRadius: 3,
        boxShadow: 3,
        borderLeft: color ? `6px solid ${color}` : "none",
        backgroundColor: "background.paper",
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Typography
          variant="subtitle2"
          sx={{ mb: 0.5, color: "text.secondary" }}
        >
          {label}
        </Typography>

        <Typography variant="h6" fontWeight="bold">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
