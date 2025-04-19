import { Navigate, Outlet } from 'react-router';
import { useEffect, useState } from 'react';
import useAuthStore from '@/shared/store/auth.store.ts';
import { isJwtExpired } from '@/shared/lib/utils';

const ProtectedRoute: React.FC = () => {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (token && isJwtExpired(token)) {
      logout();
      setIsValid(false);
    }

    const interval = setInterval(() => {
      if (token && isJwtExpired(token)) {
        logout();
        setIsValid(false);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [token, logout]);

  if (!token || !isValid) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;