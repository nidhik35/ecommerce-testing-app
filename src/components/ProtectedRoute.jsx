import { Navigate, useLocation } from "react-router-dom";
import { getSession } from "../utils/storage";

// Wrap any route that needs a signed-in user. Sends the attempted path along
// so Login can bounce the user back after a successful sign in.
export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const session = getSession();

  if (!session) {
    return (
      <Navigate to="/login" replace state={{ from: location.pathname }} />
    );
  }

  return children;
}
