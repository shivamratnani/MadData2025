import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const session = JSON.parse(localStorage.getItem("supabase_session"));
  return session ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
