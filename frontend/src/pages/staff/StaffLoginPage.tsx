import { useDispatch } from "react-redux";
import { setSession } from "../../store/SessionSlice.ts";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import LoginForm from "../../components/forms/LoginForm.tsx";
import Typography from "@mui/material/Typography";

export default function CreateStaffAccountPage() {
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
                loginType: "staff",
            }),
        );

        setLoggedIn(true);
    }

    return (
        <>
            {loggedIn ? (
                <Navigate to="/staff/dashboard" />
            ) : (
                <>
                    <LoginForm onSubmit={onLoginSubmission} />{" "}
                    <Typography
                        variant="caption"
                        sx={{ display: "block", textAlign: "center" }}
                    >
                        Don't have an account?&nbsp;
                        <Link to="/staff/login/create">Create one.</Link>
                    </Typography>
                </>
            )}
        </>
    );
}
