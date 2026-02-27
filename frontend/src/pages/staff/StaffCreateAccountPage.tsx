import CreateAccountForm from "../../components/forms/CreateAccountForm.tsx";
import { useDispatch } from "react-redux";
import { setSession } from "../../store/SessionSlice.ts";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useCreateStaffMutation } from "../../api/endpoints/StaffAPI.ts";

export default function StaffCreateAccountPage() {
    const dispatch = useDispatch();
    const [accountCreated, setAccountCreated] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [createStaff] = useCreateStaffMutation();

    async function onCreateAccountSubmission(
        email: string,
        password: string,
        firstName: string,
        lastName: string,
    ) {
        try {
            //RTK Query POST call to StaffAPI
            const response = await createStaff({
                email,
                password,
                firstName,
                lastName,
            }).unwrap();

            //Stores the userID and login type in the session
            dispatch(
                setSession({
                    userId: response["_id"],
                    loginType: "staff",
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
                <Navigate to="/staff/dashboard" />
            ) : (
                <CreateAccountForm
                    onSubmit={onCreateAccountSubmission}
                    errorMessage={errorMessage}
                />
            )}
        </>
    );
}
