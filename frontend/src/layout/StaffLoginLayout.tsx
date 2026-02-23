import { PageHeader } from "../components/PageHeader.tsx";
import StaffLoginPage from "../pages/staff/StaffLoginPage.tsx";

export default function StaffLoginLayout() {
    return (
        <>
            {/**Using the same header */}
            <PageHeader title="Staff Login" />
            {/**Login Page */}
            <div style={{ width: "100%", maxWidth: "30%", margin: "auto" }}>
                <StaffLoginPage />
            </div>
        </>
    );
}
