import React from "react";
import { Navigate, useLocation, matchPath } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { rolePermissions } from "@/utils/permission";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuth = useSelector((state: RootState) => state.user.isAuth);
  const role = useSelector((state: RootState) => state.user.role);
  const location = useLocation();

  const token = localStorage.getItem("userData");
  const storedUser = token ? JSON.parse(token) : null;
  const hasValidToken =
    storedUser?.token &&
    storedUser?.expiresAt &&
    new Date(storedUser.expiresAt) > new Date();

  if (!isAuth && !hasValidToken) {
    return <Navigate to="/sign-in" replace />;
  }

  const allowedRoutes = rolePermissions[role] || [];
  const currentPath = location.pathname;

  // Fix: use matchPath for dynamic route patterns like /branch/view/edit/:id
  const isAllowed = allowedRoutes.some((route) =>
    matchPath({ path: route, end: true }, currentPath)
  );

  if (!isAllowed) {
    return <Navigate to="/page-forbidden" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
