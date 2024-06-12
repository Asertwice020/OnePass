import { useSelector } from "react-redux";
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  return isLoggedIn ? children : <Navigate to={"/onboarding"} />;
};

export default ProtectedRoute;