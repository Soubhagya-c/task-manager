import { Navigate } from "react-router-dom";
import { getUserFromToken } from "../utils/token";
import type { JSX } from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const user = getUserFromToken();
  if(!user) {
    <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
