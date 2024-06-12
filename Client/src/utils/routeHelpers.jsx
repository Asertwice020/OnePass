import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";

const createProtectedRoute = (path, element) => (
  <Route path={path} element={<ProtectedRoute>{element}</ProtectedRoute>} />
);

const createPublicRoute = (path, element) => (
  <Route path={path} element={<PublicRoute>{element}</PublicRoute>} />
);

export { createProtectedRoute, createPublicRoute };