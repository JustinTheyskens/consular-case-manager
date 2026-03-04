import CreateAccountForm from "../../components/forms/CreateAccountForm.tsx";
import { useDispatch } from "react-redux";
import { setSession } from "../../store/SessionSlice.ts";
import { useCreateCitizenMutation } from "../../api/endpoints/CitizensAPI.ts";
import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function CitizenCreateAccountPage() {
    const dispatch = useDispatch();
    const [accountCreated, setAccountCreated] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [createCitizen] = useCreateCitizenMutation();

    async function onCreateAccountSubmission(
        email: string,
        password: string,
        firstName: string,
        lastName: string,
    ) {
        try {
            //RTK Query POST call to CitizensAPI
            const response = await createCitizen({
                email,
                password,
                firstName,
                lastName,
            }).unwrap();

            //Stores the userID and login type in the session
            dispatch(
                setSession({
                    userId: response["_id"],
                    loginType: "citizen",
                    emailAddress: email,
                }),
            );

            //REDIRECT USER TO APPROPRIATE LOGIN PAGE
            setAccountCreated(true);
        } catch (err) {
            setErrorMessage("Failed to create account. Please try again.");
        }
    }

    return (
        <>
            {accountCreated ? (
                <Navigate to="/user/dashboard" />
            ) : (
                <CreateAccountForm
                    onSubmit={onCreateAccountSubmission}
                    errorMessage={errorMessage}
                />
            )}
        </>
    );
}
