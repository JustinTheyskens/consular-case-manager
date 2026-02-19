import { BrowserRouter, Routes, Route } from "react-router";
import CssBaseline from "@mui/material/CssBaseline";
import { PageHeader } from "./components/PageHeader";
import { StaffDashboard } from "./layout/StaffDashboardLayout";

export default function App() {
    return (
        <>
        <StaffDashboard></StaffDashboard>
        <BrowserRouter>
            <CssBaseline />
            <Routes>
                <Route
                    path="/"
                    element={<div className="TODO--HOME-LAYOUT">Home layout</div>}
                >
                    <Route
                        path="user/login"
                        element={<div className="TODO--USER-LOGIN">User Login</div>}
                    />
                    <Route
                        path="user/dashboard"
                        element={<div className="TODO--USER-DASHBOARD">User Dashboard</div>}
                    />

                    <Route
                        path="staff/login"
                        element={<div className="TODO--STAFF-LOGIN">Staff Login</div>}
                    />
                    <Route
                        path="staff/dashboard"
                        element={<div className="TODO--STAFF-DASHBOARD">Staff Dashboard</div>}
                    />

                    <Route path="dashboard"></Route>
                </Route>
            </Routes>
        </BrowserRouter>
        </>
    );
}
