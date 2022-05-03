import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  // check if user is logged in
  return auth?.userRole && allowedRoles?.includes(auth?.userRole)
      ? <Outlet /> // show components only if user is logged in and authorized
      : auth?.username
          ? <Navigate to="/unauthorized" state={{ from: location }} replace /> // if logged in but unauthorized, redirect to unauthorized page
          : <Navigate to="/login" /> // if not logged in, redirect user to login page from where they came from
};

export default RequireAuth;
