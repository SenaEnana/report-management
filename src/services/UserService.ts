import apiClient from "@/utils/ApiClient";

export const createUserAPI = async (
  first_name: string,
  last_name: string,
  username: string,
  role: string,
  password: string,
) => {
  try {
    const { data } = await apiClient.post("/api/auth/users", {
        first_name,
        last_name,
        username,
        role,
        password,
    });
    return data;
  } catch (error: any) {
    console.error("Error on creating password:", error.message);
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";

    throw new Error(errorMessage);
  }
};

export const fetchUsersApi = async () => {
  try {
    const response = await apiClient.get("/api/auth/users");
    const data = response.data; // Directly get the array
    return { data, totalItems: data.length };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
};

export const updateUserApi = async (
    id: string,
    first_name: string,
    last_name: string,
    username: string,
    role: string,
    password: string,
) => {
    try {
        const { data } = await apiClient.put(`/api/auth/users/${id}`, {
            first_name,
            last_name,
            username,
            role,
            password,
        });
        return data;
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message || "An unexpected error occurred";

        throw new Error(errorMessage);
    }
};

export const softDeleteUserApi = async (user_id: string) => {
    try {
        const response = await apiClient.delete(`/api/auth/users/${user_id}`);
        if (response.status === 200 || response.status === 204) {
            return true;
        } else {
            return false;
        }
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message || "An unexpected error occurred";

        throw new Error(errorMessage);
    }
};
