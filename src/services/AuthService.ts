import axios from "axios";
import apiClient from "@/utils/ApiClient";

interface SignInResponse {
  token: string | null;
  token_type: string;
  expires_at: string;
  user: {
    user_id: string;
    username: string;
    role: string;
  };
}

export const signIn = async (
  username: string,
  password: string,
): Promise<SignInResponse | void> => {
  try {

    const response = await axios.post<SignInResponse>(
      "http://172.24.111.254:5000/api/auth/login",
      {
        username: username,
        password: password,
      }
    );

    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";

    throw new Error(errorMessage);
  }
};

export default { signIn };

export const changePasswordApi = async (
  currentPassword: string,
  newPassword: string,
) => {
  try {
    const { data } = await apiClient.post("/api/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return data;
  } catch (error: any) {
    console.error("Error on changing password:", error.message);
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";

    throw new Error(errorMessage);
  }
};
