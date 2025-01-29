import useAuthStore from "@/shared/store/auth.store";
import { LoginForm } from "@/widgets/sign-in/ui/login-form";

import { Navigate } from "react-router";

export default function Page() {
  const token = useAuthStore((state) => state.token);

  if (token) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
