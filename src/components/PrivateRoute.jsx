import React from "react";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
