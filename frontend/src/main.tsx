import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { sessionStore } from "./store/session-store.tsx";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={sessionStore}>
            <App />
        </Provider>
    </StrictMode>,
);
