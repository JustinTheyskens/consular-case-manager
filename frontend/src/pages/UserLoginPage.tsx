import { useNavigate } from "react-router-dom";
import LoginForm from "../components/forms/LoginForm";

export default function UserLoginPage() {
    const navigate = useNavigate();

    const handleUserLogin = async (emailAddress: string, password: string) => {
        
        navigate("/user/dashboard");
    };

    return <LoginForm onSubmit={handleUserLogin} />;
}
