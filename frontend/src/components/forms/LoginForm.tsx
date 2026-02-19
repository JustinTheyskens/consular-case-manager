import { Button, TextField, Box } from "@mui/material";
import { useState } from "react";

interface LoginFormProps {
    onSubmit: (event: React.SyntheticEvent<HTMLFormElement>) => void;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
    const [submitting, setSubmitting] = useState(false);

    //Disables the "Create Account" button while sumitting is in progress
    //If the code flows back into this form, the button is re-enabled.
    function submitForm(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        setSubmitting(true);
        onSubmit(event);

        //We generally shouldn't return back to here
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
                    id="username-field"
                    label="Username"
                    variant="outlined"
                    size="small"
                    sx={{ m: 2, width: 0.8 }}
                />

                <TextField
                    id="password-field"
                    type="password"
                    label="Password"
                    variant="outlined"
                    size="small"
                    sx={{ m: 2, width: 0.8 }}
                />

                <Button
                    type="submit"
                    disabled={submitting}
                    variant="contained"
                    sx={{ m: 2, width: 0.8 }}
                >
                    Login
                </Button>
            </Box>
        </>
    );
}
