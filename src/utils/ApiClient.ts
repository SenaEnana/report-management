import axios from "axios";
import { signOut } from "@/store/slices/user-slice"; 
import store from "../store/store"; 

// Create an Axios instance
const apiClient = axios.create({
  baseURL: "http://dev.harambeeuniversity.edu.et:8080", 
  // baseURL: "http://196.189.233.123:8080", 
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
      // Add token to Authorization header
      config.headers.Authorization = `Bearer ${token}`;

      // Check if token is expired
      const currentTime = new Date().getTime();
      const tokenExpiry = new Date(tokenExpiresAt || 0).getTime();

      if (currentTime >= tokenExpiry) {
        
        
        // Token expired, dispatch signOut action
        store.dispatch(signOut());

        // Redirect to login page
       window.location.href = "/sign-in";
        // Replace with the route to your login page

        return Promise.reject(new Error("Token expired. Redirecting to login."));
      }
      
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
