import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export const PageHeader = ({ title, subtitle, children }: PageHeaderProps) => {
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
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
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

        {children}
      </Box>
    </Box>
  );
};
