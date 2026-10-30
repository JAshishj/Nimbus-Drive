import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext.jsx";
import Spinner from "./Spinner.jsx";

export function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="grid h-screen place-items-center px-6 text-center">
        <div className="flex flex-col items-center">
          <Spinner className="h-6 w-6 text-accent" />
          <p className="mt-4 text-sm text-mute">
            Initial load might take up to a minute on the first visit.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}