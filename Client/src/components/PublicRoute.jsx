import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  

  return isLoggedIn ? <Navigate to={navigate(-1)} /> : children;
};

export default PublicRoute;