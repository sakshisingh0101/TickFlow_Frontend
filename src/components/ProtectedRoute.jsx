import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ allowedRoles }) {
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const userRole = (user?.role || user?.userType || user?.usertype)?.toString().toLowerCase();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is provided and user role is not in the list, redirect to home
  if (allowedRoles && (!userRole || !allowedRoles.map((role) => role.toString().toLowerCase()).includes(userRole))) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
