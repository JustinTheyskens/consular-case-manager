import { Button, TextField, Box } from "@mui/material";
import { useState } from "react";

interface CreateAccountFormProps {
    onSubmit: (emailAddress: string, password: string, firstName: string, lastName: string) => void;
}

export default function CreateAccountForm({ onSubmit }: CreateAccountFormProps) {
    const [submitting, setSubmitting] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    //Disables the "Create Account" button while sumitting is in progress
    //If the code flows back into this form, the button is re-enabled.
    function submitForm(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        setSubmitting(true);
        onSubmit(email, password, firstName, lastName);

        //We generally shouldn't return back to here without a redirect happening
        //but if we do then we know there's an error and the button is re-enabled
        setSubmitting(false);
    }

    return (
        <>
            <Box
                component="form"
                onSubmit={submitForm}
            >
                <TextField
                    id="email-field"
                    label="Email Address"
                    variant="outlined"
                    size="small"
                    sx={{ m: 2, width: 0.8 }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                    id="password-field"
                    type="password"
                    label="Password"
                    variant="outlined"
                    size="small"
                    sx={{ m: 2, width: 0.8 }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <TextField
                    id="first-name-field"
                    label="First Name"
                    variant="outlined"
                    size="small"
                    sx={{ m: 2, width: 0.8 }}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />

                <TextField
                    id="last-name-field"
                    label="Last Name"
                    variant="outlined"
                    size="small"
                    sx={{ m: 2, width: 0.8 }}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />

                <Button
                    type="submit"
                    disabled={submitting}
                    variant="contained"
                    sx={{ m: 2, width: 0.8 }}
                >
                    Create Account
                </Button>
            </Box>
        </>
    );
}
