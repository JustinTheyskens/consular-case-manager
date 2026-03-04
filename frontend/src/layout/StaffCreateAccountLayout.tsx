import { ThemeProvider } from "@mui/material";
import { PageHeader } from "../components/PageHeader.tsx";
import StaffCreateAccountPage from "../pages/staff/StaffCreateAccountPage.tsx";
import { theme } from "../theme.ts";

export default function StaffCreateAccountLayout() {
    return (
        <>
            <ThemeProvider theme={theme}>
                {/**Using the same header */}
                <PageHeader title="Staff Create Account" />
                {/**CreateAccount Page */}
                <div style={{ width: "100%", maxWidth: "30%", margin: "auto" }}>
                    <StaffCreateAccountPage />
                </div>
            </ThemeProvider>
        </>
    );
}
