import { BrowserRouter, Routes, Route } from "react-router";
import CssBaseline from "@mui/material/CssBaseline";
import { StaffDashboard } from "./layout/StaffDashboardLayout";
import UserLoginPage from "./pages/UserLoginPage";
import StaffLoginPage from "./pages/StaffLoginPage";
import { useNavigate } from "react-router";
import { HomeLayout } from "./layout/HomeLayout";
import { UserDashboard } from "./layout/CitizenDashboardLayout";

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
                        {" "}
                    </Route>
                    <Route
                        path="user/login"
                        element={<UserLoginPage />}
                    />
                    <Route
                        path="user/dashboard"
                        element={<UserDashboard/>}
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
                </Routes>
            </BrowserRouter>
        </>
    );
}
