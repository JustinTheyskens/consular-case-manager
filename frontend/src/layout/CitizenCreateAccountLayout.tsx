import { ThemeProvider } from "@mui/material";
import { PageHeader } from "../components/PageHeader.tsx";
import CitizenCreateAccountPage from "../pages/citizen/CitizenCreateAccountPage.tsx";
import { theme } from "../theme.ts";

export default function CitizenCreateAccountLayout() {
    return (
        <>
            <ThemeProvider theme={theme}>
                {/**Using the same header*/}
                <PageHeader title="Citizen Create Account" />
                {/**CreateAccount Page */}
                <div style={{ width: "100%", maxWidth: "30%", margin: "auto" }}>
                    <CitizenCreateAccountPage />
                </div>
            </ThemeProvider>
        </>
    );
}
