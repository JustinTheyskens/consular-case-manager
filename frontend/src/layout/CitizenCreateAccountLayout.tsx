import { PageHeader } from "../components/PageHeader.tsx";
import CitizenCreateAccountPage from "../pages/citizen/CitizenCreateAccountPage.tsx";

export default function CitizenCreateAccountLayout() {
    return (
        <>
            {/**Using the same header*/}
            <PageHeader title="Citizen Create Account" />
            {/**CreateAccount Page */}
            <div style={{ width: "100%", maxWidth: "30%", margin: "auto" }}>
                <CitizenCreateAccountPage />
            </div>
        </>
    );
}
