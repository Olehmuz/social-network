import { Navigate, Outlet } from 'react-router';
import useAuthStore from '@/shared/store/auth.store.ts';

const ProtectedRoute: React.FC = () => {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};


export default ProtectedRoute;