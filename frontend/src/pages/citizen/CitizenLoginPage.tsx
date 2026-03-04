import { useDispatch } from "react-redux";
import { setSession } from "../../store/SessionSlice.ts";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import LoginForm from "../../components/forms/LoginForm.tsx";
import { Typography } from "@mui/material";
import { useSendLoginMutation } from "../../api/endpoints/LoginAPI.ts";

export default function CitizenLoginPage() {
    const dispatch = useDispatch();
    const [loggedIn, setLoggedIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [sendLogin] = useSendLoginMutation();

    async function onLoginSubmission(email: string, password: string) {
        try {
            //RTK Query POST call to CitizensAPI
            const response = await sendLogin({
                email,
                password,
            }).unwrap();

            //Stores the userID and login type in the session
            dispatch(
                setSession({
                    userId: response["userId"],
                    loginType: "citizen",
                    emailAddress: email,
                }),
            );
            setLoggedIn(true);
        } catch (err) {
            setErrorMessage("Failed to log in. Please try again.");
        }
    }

    return (
        <>
            {loggedIn ? (
                <Navigate to="/user/dashboard" />
            ) : (
                <>
                    <LoginForm
                        onSubmit={onLoginSubmission}
                        errorMessage={errorMessage}
                    />
                    <Typography
                        variant="caption"
                        sx={{ display: "block", textAlign: "center" }}
                    >
                        Don't have an account?&nbsp;
                        <Link to="/user/login/create">Create one.</Link>
                    </Typography>
                </>
            )}
        </>
    );
}
