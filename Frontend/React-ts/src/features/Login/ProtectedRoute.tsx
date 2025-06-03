import type { JSX } from "@emotion/react/jsx-runtime";
import { Navigate } from "react-router-dom";

interface Props {
  allowedRoles: string[];
  children: JSX.Element;
}

export default function ProtectedRoute({ allowedRoles, children }: Props) {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  if (!token || !rol || !allowedRoles.includes(rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
