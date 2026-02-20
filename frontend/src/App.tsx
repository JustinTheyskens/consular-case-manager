import { BrowserRouter, Routes, Route } from "react-router";
import CssBaseline from "@mui/material/CssBaseline";
import { StaffDashboard } from "./layout/StaffDashboardLayout";
import UserLoginPage from './pages/UserLoginPage';
import StaffLoginPage from './pages/StaffLoginPage';


import { Outlet } from "react-router-dom";

const HomeLayout = () => {
    return (
        <div>
            <h1>Consular Case Manager</h1>
            <Outlet />
        </div>
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
