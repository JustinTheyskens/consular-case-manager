import { BrowserRouter, Routes, Route } from "react-router";
import CssBaseline from "@mui/material/CssBaseline";
import { StaffDashboard } from "./layout/StaffDashboardLayout";
import UserLoginPage from "./pages/UserLoginPage";
import StaffLoginPage from "./pages/StaffLoginPage";
import { Box } from "@mui/material";
import { useNavigate } from "react-router";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./theme";
import { PageHeader } from "./components/PageHeader";
import Grid from "@mui/material/Grid";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";
import { MetricCard } from "./components/MetricCard";

// const navigate = useNavigate();
const HomeLayout = () => {
    return (
        <ThemeProvider theme={theme}>
            <Box minHeight="100vh">
                <PageHeader
                    title="Consular Case Manager"
                    subtitle="Passport appointments and case tracking"
                />

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
                        spacing={4}
                        justifyContent="center"
                    >
                        <Grid size={{ xs: 12, sm: 8, md: 5 }}>
                            {/* <Box
                                onClick={() => navigate("/staff/login")}
                                sx={{ cursor: "pointer" }}
                            ></Box> */}
                            <MetricCard
                                label="Staff Login"
                                icon={<AdminPanelSettingsIcon sx={{ fontSize: 64 }} />}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 8, md: 5 }}>
                            {/* <Box
                                onClick={() => navigate("/user/login")}
                                sx={{ cursor: "pointer" }}
                            ></Box> */}
                            <MetricCard
                                label="User Login"
                                icon={<PersonIcon sx={{ fontSize: 64 }} />}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default function App() {
    return (
        <>
            {/* <StaffDashboard/> */}
            <BrowserRouter>
                <CssBaseline />
                <Routes>
                    <Route
                        path="/"
                        element={<HomeLayout />}
                    >
                        <Route
                            path="user/login"
                            element={<UserLoginPage />}
                        />
                        <Route
                            path="user/dashboard"
                            element={<div className="TODO--USER-DASHBOARD">User Dashboard</div>}
                        />

                        <Route
                            path="staff/login"
                            element={<StaffLoginPage />}
                        />
                        <Route
                            path="staff/dashboard"
                            element={<StaffDashboard />}
                        />

                        <Route path="dashboard"></Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}
