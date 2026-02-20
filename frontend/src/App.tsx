import { BrowserRouter, Routes, Route } from "react-router";
import CssBaseline from "@mui/material/CssBaseline";
import { StaffDashboard } from "./layout/StaffDashboardLayout";
import UserLoginPage from "./pages/UserLoginPage";
import StaffLoginPage from "./pages/StaffLoginPage";
import { Box } from "@mui/material";

import { Outlet } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./theme";
import { PageHeader } from "./components/PageHeader";

const HomeLayout = () => {
    return (
        <ThemeProvider theme={theme}>
            <Box minHeight="100vh">
                <PageHeader
                    title="Consular Case Manager"
                    subtitle="Passport appointments and case tracking"
                />
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
