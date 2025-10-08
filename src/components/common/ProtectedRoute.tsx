import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store"; // Update the path based on your project structure

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuth = useSelector((state: RootState) => state.user.isAuth);

  if (!isAuth) {
    // Redirect to the sign-in page if not authenticated
    return <Navigate to="/sign-in" />;
  }

  // Render the children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
