import { ThemeProvider } from "@mui/material";
import { PageHeader } from "../components/PageHeader.tsx";
import StaffLoginPage from "../pages/staff/StaffLoginPage.tsx";
import { theme } from "../theme.ts";

export default function StaffLoginLayout() {
    return (
        <>
            <ThemeProvider theme={theme}>
                {/**Using the same header */}
                <PageHeader title="Staff Login" />
                {/**Login Page */}
                <div style={{ width: "100%", maxWidth: "30%", margin: "auto" }}>
                    <StaffLoginPage />
                </div>
            </ThemeProvider>
        </>
    );
}
