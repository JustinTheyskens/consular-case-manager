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
                }),
            );
            setLoggedIn(true);
        } catch (err) {
            console.log("Failed to log in.");
            console.log(err);
        }
    }

    return (
        <>
            {loggedIn ? (
                <Navigate to="/user/dashboard" />
            ) : (
                <>
                    <LoginForm onSubmit={onLoginSubmission} />
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
