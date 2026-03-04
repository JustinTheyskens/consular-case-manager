import { ThemeProvider } from "@mui/material";
import { PageHeader } from "../components/PageHeader.tsx";
import CitizenLoginPage from "../pages/citizen/CitizenLoginPage.tsx";
import { theme } from "../theme.ts";

export default function CitizenLoginLayout() {
    return (
        <>
            <ThemeProvider theme={theme}>
                {/**Using the same header */}
                <PageHeader title="Citizen Login" />
                {/**Login Page */}
                <div style={{ width: "100%", maxWidth: "30%", margin: "auto" }}>
                    <CitizenLoginPage />
                </div>
            </ThemeProvider>
        </>
    );
}
