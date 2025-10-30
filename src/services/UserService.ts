import apiClient from "@/utils/ApiClient";

interface User {
    roles: any;
    campuses: any;
    id: number;
    first_name: string;
    last_name: string;     
    username: string;
    gender_id: string;
    password: string;
    password_confirmation: string;
    created_at: string | null;
    updated_at: string | null;
    deleted_at: string | null;
}

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

export const getUserApi = async () => {
    try {
        const { data } = await apiClient.get("/api/users/get-all");
        if (!Array.isArray(data.data)) {
            throw new Error("Unexpected response format: data is not an array");
        }
        return data.data;
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message || "An unexpected error occurred";

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

export async function getUserByIdApi(id: string): Promise<{ data: User }> {
    try {
        const { data } = await apiClient.get(`/api/users/${id}`);
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
