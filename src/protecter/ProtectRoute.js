// @ts-ignore
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;