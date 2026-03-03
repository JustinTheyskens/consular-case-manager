import { BrowserRouter, Routes, Route } from "react-router";
import CssBaseline from "@mui/material/CssBaseline";
import { StaffDashboard } from "./layout/StaffDashboardLayout";
import UserLoginPage from "./pages/UserLoginPage";
import { useNavigate } from "react-router";
import { HomeLayout } from "./layout/HomeLayout";
import { UserDashboard } from "./layout/CitizenDashboardLayout";
import CitizenLoginLayout from "./layout/CitizenLoginLayout.tsx";
import CitizenCreateAccountLayout from "./layout/CitizenCreateAccountLayout";
import StaffLoginLayout from "./layout/StaffLoginLayout.tsx";
import StaffCreateAccountLayout from "./layout/StaffCreateAccountLayout.tsx";

import StaffDashboardMetrics from "./layout/StaffDashboardMetrics.tsx";

export default function App() {
  return (
    <>
      {/* <StaffDashboard/> */}
      <BrowserRouter>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<HomeLayout />}>
            {" "}
          </Route>
          <Route path="user/login" element={<CitizenLoginLayout />} />
          <Route
            path="user/login/create"
            element={<CitizenCreateAccountLayout />}
          />
          <Route path="user/dashboard" element={<UserDashboard />} />

          <Route path="staff/login" element={<StaffLoginLayout />} />
          <Route
            path="staff/login/create"
            element={<StaffCreateAccountLayout />}
          />
          <Route path="staff/dashboard" element={<StaffDashboard />} />

          {/** Team 2 Additional requirements dashboard Metrics section */}
          <Route
            path="staff/dashboard/metrics"
            element={<StaffDashboardMetrics />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
