import CreateAccountForm from "../../components/forms/CreateAccountForm.tsx";
import { useDispatch } from "react-redux";
import { setSession } from "../../store/SessionSlice.ts";
import { useCreateCitizenMutation } from "../../api/endpoints/CitizensAPI.ts";
import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function CitizenCreateAccountPage() {
    const dispatch = useDispatch();
    const [accountCreated, setAccountCreated] = useState(false);

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
                }),
            );

            //REDIRECT USER TO APPROPRIATE LOGIN PAGE
            setAccountCreated(true);
        } catch (err) {
            console.log("Failed to create Citizen");
            console.log(err);
        }
    }

    return (
        <>
            {accountCreated ? (
                <Navigate to="/user/dashboard" />
            ) : (
                <CreateAccountForm onSubmit={onCreateAccountSubmission} />
            )}
        </>
    );
}
