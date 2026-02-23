import { PageHeader } from "../components/PageHeader.tsx";
import CitizenLoginPage from "../pages/citizen/CitizenLoginPage.tsx";

export default function CitizenLoginLayout() {
    return (
        <>
            {/**Using the same header */}
            <PageHeader title="Citizen Login" />
            {/**Login Page */}
            <div style={{ width: "100%", maxWidth: "30%", margin: "auto" }}>
                <CitizenLoginPage />
            </div>
        </>
    );
}
