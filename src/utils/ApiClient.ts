import axios from "axios";
import { signOut } from "@/store/slices/user-slice"; 
import store from "../store/store"; 

// Create an Axios instance
const apiClient = axios.create({
  baseURL: "http://172.24.111.254:5000/", 
});

// Set global headers
apiClient.defaults.headers.common["Accept"] = "application/json";
apiClient.defaults.headers.post["Content-Type"] = "application/json";

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const { token } = state.user;
    const userData = localStorage.getItem("userData");
    const userDataJson = userData ? JSON.parse(userData): null;
    const tokenExpiresAt = userDataJson.expiresAt;

    // Check if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;

      // Check if token is expired
      const currentTime = new Date().getTime();
      const tokenExpiry = new Date(tokenExpiresAt || 0).getTime();

      if (currentTime >= tokenExpiry) {
        
        store.dispatch(signOut());

       window.location.href = "/sign-in";

        return Promise.reject(new Error("Token expired. Redirecting to login."));
      }
      
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
