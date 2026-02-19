import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import CreateAccountForm from "./components/forms/CreateAccountForm.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
        <CreateAccountForm onSubmit={(email, password, firstName, lastName) => {}} />
    </StrictMode>,
);
