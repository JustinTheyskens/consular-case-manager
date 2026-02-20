import { useDispatch } from "react-redux";
import { setSession } from "../../store/session-store.tsx";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import LoginForm from "../../components/forms/LoginForm.tsx";

export default function CreateCitizenAccountPage() {
    const [loggedIn, setLoggedIn] = useState(false);

    async function onLoginSubmission(email: string, password: string) {
        //TODO: Replace fetch with RTK Query call
        const api_url = import.meta.env.VITE_API_URL;

        const request = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        };
        const response = await fetch(api_url, request);

        if (!response.ok) {
            throw new Error(`Request failed: ${response.status} ${response.statusText}`);
        }

        const createdUserInfo = await response.json();

        const dispatch = useDispatch();

        dispatch(
            setSession({
                userId: createdUserInfo.userId,
                loginType: "citizen",
            }),
        );

        setLoggedIn(true);
    }

    return (
        <>
            {loggedIn ? (
                <Navigate to="/citizen/dashboard" />
            ) : (
                <LoginForm onSubmit={onLoginSubmission} />
            )}
        </>
    );
}
