import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

<<<<<<< HEAD
export const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
    return (
        <Box
            data-testid="page-header"
            sx={{
                mb: 4,
                px: 4,
                py: 3,
                backgroundColor: "primary.main",
                color: "primary.contrastText",
            }}
        >
            <Typography variant="h1">{title}</Typography>
=======
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
>>>>>>> origin/dev

          {subtitle && (
            <Typography
              variant="body2"
              sx={{ mt: 0.5, color: "primary.contrastText" }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
<<<<<<< HEAD
    );
=======

        {children}
      </Box>
    </Box>
  );
>>>>>>> origin/dev
};
