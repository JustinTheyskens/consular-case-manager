import CreateAccountForm from "../../components/forms/CreateAccountForm.tsx";
import { useDispatch } from "react-redux";
import { setSession } from "../../store/SessionSlice.ts";
import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function StaffCreateAccountPage() {
    const [accountCreated, setAccountCreated] = useState(false);

    async function onCreateAccountSubmission(
        email: string,
        password: string,
        firstName: string,
        lastName: string,
    ) {
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
                firstName,
                lastName,
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

        //REDIRECT USER TO APPROPRIATE LOGIN PAGE
        setAccountCreated(true);
    }

    return (
        <>
            {accountCreated ? (
                <Navigate to="/staff/dashboard" />
            ) : (
                <CreateAccountForm onSubmit={onCreateAccountSubmission} />
            )}
        </>
    );
}
