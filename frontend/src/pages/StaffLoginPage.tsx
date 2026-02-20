import { useNavigate } from "react-router-dom";
import LoginForm from "../components/forms/LoginForm";

export default function StaffLoginPage() {
    const navigate = useNavigate();

    const handleLogin = async (emailAddress: string, password: string) => {
        navigate("/staff/dashboard/");
    };

    return <LoginForm onSubmit={handleLogin} />;
}
