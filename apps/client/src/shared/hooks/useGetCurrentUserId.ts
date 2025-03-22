import useAuthStore from "../store/auth.store";

export const useGetCurrentUserId = () => {
  return useAuthStore((state) => state.userId);

}