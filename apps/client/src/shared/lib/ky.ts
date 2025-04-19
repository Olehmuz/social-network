import ky from "ky";
import useAuthStore from "../store/auth.store";

const API_BASE_URL = "http://localhost:3001";

const kyInstance = ky.extend({
  prefixUrl: API_BASE_URL,
  hooks: {
    beforeRequest: [
      request => {
        const token = useAuthStore.getState().token;
        console.log(token);
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      }
    ]
  }
});

export default kyInstance;