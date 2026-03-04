import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { clearSession } from "../store/SessionSlice";
import type { RootState } from "../store/Store";
import { useGetCitizenByIdQuery } from "../api/endpoints/CitizensAPI";
import { useGetStaffByIdQuery } from "../api/endpoints/StaffAPI";

interface ProtectedRouteProps {
    expectedUserType: "citizen" | "staff";
}

export default function ProtectedRoute({ expectedUserType }: ProtectedRouteProps) {
    const { userId, loginType, emailAddress } = useSelector((state: RootState) => state.session);
    const dispatch = useDispatch();

    //At any given time, we are either a citizen or a staff
    //We can skip the other.
    const citizenQuery = useGetCitizenByIdQuery(userId!, {
        skip: !userId || loginType !== "citizen",
    });

    const staffQuery = useGetStaffByIdQuery(userId!, {
        skip: !userId || loginType !== "staff",
    });

    const activeQuery = loginType === "citizen" ? citizenQuery : staffQuery;

    const shouldClearSession =
        !userId ||
        !loginType ||
        (!activeQuery.isLoading &&
            !activeQuery.isUninitialized &&
            (activeQuery.isError || !activeQuery.data));

    // Clear session to avoid dispatching during render, which causes errors
    useEffect(() => {
        if (shouldClearSession) {
            dispatch(clearSession());
        }
    }, [shouldClearSession, dispatch]);

    // If they have no session at all, redirect them to the appropriate login page for the route they're trying to access
    if (!userId || !loginType) {
        return (
            <Navigate
                to={`/${expectedUserType === "staff" ? expectedUserType : "user"}/login`}
                replace
            />
        );
    }

    // If they're on the wrong type of login, redirect them to the appropriate login page for the route they're trying to access
    if (loginType !== expectedUserType) {
        return (
            <Navigate
                to={`/${expectedUserType === "staff" ? expectedUserType : "user"}/login`}
                replace
            />
        );
    }

    // If the query failed or returned no data, send them back to the login page just in case.
    if (activeQuery.isError || !activeQuery.data) {
        return (
            <Navigate
                to={`/${expectedUserType === "staff" ? expectedUserType : "user"}/login`}
                replace
            />
        );
    }

    return <Outlet />;
}
