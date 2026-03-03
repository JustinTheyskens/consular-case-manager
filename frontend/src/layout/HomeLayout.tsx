import { Box } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { theme } from "../theme";
import { PageHeader } from "../components/PageHeader";
import Grid from "@mui/material/Grid";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";
import { LoginCard } from "../components/LoginCard";
import { useNavigate } from "react-router-dom";

export const HomeLayout = () => {
    const navigate = useNavigate();
    return (
        <ThemeProvider theme={theme}>
            <Box minHeight="100vh">
                <PageHeader
                    title="Consular Case Manager"
                    subtitle="Passport appointments and case tracking"
                />
                {/* Buttons Container */}
                <Box
                    sx={{
                        px: 3,
                        minHeight: "calc(100vh - 200px)",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Grid
                        container
                        spacing={2}
                        justifyContent="center"
                    >
                        <Grid size={{ xs: 12, sm: 8, md: 4 }}>
                            <Box
                                sx={{
                                    width: 300, // too small?
                                    height: 300,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mx: "auto",
                                }}
                            >
                                <LoginCard
                                    data-testid="staff-login-btn"
                                    onClick={() => navigate("/staff/login")}
                                    label="Staff Login"
                                    icon={<AdminPanelSettingsIcon sx={{ fontSize: 64 }} />}
                                />
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 8, md: 4 }}>
                            <Box
                                sx={{
                                    width: 300, // or whatever size fits your layout
                                    height: 300,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mx: "auto", // centers the box within the grid cell
                                }}
                            >
                                <LoginCard
                                    data-testid="user-login-btn"
                                    onClick={() => navigate("/user/login")}
                                    label="User Login"
                                    icon={<PersonIcon sx={{ fontSize: 64 }} />}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </ThemeProvider>
    );
};
