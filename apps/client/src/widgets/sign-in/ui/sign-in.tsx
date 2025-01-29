import useAuthStore from "@/shared/store/auth.store";
import { Navigate } from "react-router";

const SignIn = () => {
  const token = useAuthStore((state) => state.token);

  if (token) {
    return <Navigate to="/" />;
  }

  return 'signin'
}

export { SignIn }