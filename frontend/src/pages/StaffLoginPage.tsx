import { useNavigate } from "react-router-dom";
import LoginForm from "../components/forms/LoginForm";
import { ThemeProvider } from "@emotion/react";
import { Box } from "@mui/material";
import { PageHeader } from "../components/PageHeader";
import { theme } from "../theme";
import { Typography } from "@mui/material";

export default function StaffLoginPage() {
    const navigate = useNavigate();

    const handleLogin = async (emailAddress: string, password: string) => {
        navigate("/staff/dashboard/");
    };
    const label = "Staff Login";

    return (
        <ThemeProvider theme={theme}>
            <Box minHeight="100vh">
                <PageHeader
                    title="Consular Case Manager"
                    subtitle="Passport appointments and case tracking"
                />
                <Typography
                    sx={{ p: 2 }}
                    variant="h1"
                    color="primary.main"
                >
                    {label}
                </Typography>
                <LoginForm onSubmit={handleLogin} />
            </Box>
        </ThemeProvider>
    );
}
