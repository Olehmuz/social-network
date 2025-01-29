import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import ky from 'ky';
import { decodeJWT } from '../lib/utils';

interface AuthState {
  token: string | null;
  userId: string | null;
  setAuth: (token: string) => void;
  isAuthenticated: () => boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      userId: null,

      setAuth: (token) => set({ token }),

      isAuthenticated: () => !!get().token,

      logout: () => set({ token: null, userId: null }),

      login: async (email: string, password: string) => {
        const { access_token } = await ky
          .post('http://localhost:3001/signIn', {
            json: {
              email,
              password,
            },
          })
          .json<{ access_token: string }>();

        const { userId } = decodeJWT(access_token) as { userId: string };

        set({ token: access_token, userId });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, userId: state.userId }),
    },
  ),
);

export default useAuthStore;
