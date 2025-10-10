import axios from "axios";
import apiClient from "@/utils/ApiClient";

interface SignInResponse {
  access_token: string;
  token_type: string;
  expires_at: string;
  user: {
    user_id: string;
    username: string;
  };
}
export const signIn = async (
  username: string,
  password: string,
): Promise<SignInResponse | void> => {
  try {
    console.log("request: ", username, password);

    const response = await axios.post<SignInResponse>(
      "http://172.24.111.254:5000/api/auth/login",
      {
        username: username,
        password: password,
      }
    );

    // Handle successful response
    console.log("User signed in:", response.data);

    return response.data;
  } catch (error: any) {
    // Handle error
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error response:", error.response.data);
    } else {
      console.error("Error message:", error.message);
    }
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";

    throw new Error(errorMessage);
  }
};

export default { signIn };

export const changePasswordApi = async (
  current_password: string,
  password: string,
  confirm_password: string,
) => {
  try {
    const { data } = await apiClient.post("/api/auth/change-password", {
      current_password,
      password,
      confirm_password,
    });
    return data;
  } catch (error: any) {
    console.error("Error on changing password:", error.message);
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";

    throw new Error(errorMessage);
  }
};