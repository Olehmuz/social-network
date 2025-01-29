import ky from "ky";
import useAuthStore from "../store/auth.store";

const token = useAuthStore.getState().token

const API_BASE_URL = "http://localhost:3001";

const kyInstance = ky.extend({
  prefixUrl: API_BASE_URL,
  headers: {
    Authorization: token ? `Bearer ${token}` : undefined,
  },
});

export default kyInstance;