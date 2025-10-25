import apiClient from "@/utils/ApiClient";

interface User {
    roles: any;
    campuses: any;
    id: number;
    name: string;
    email: string;
    username: string,
    gender_id: string,
    password: string;
    password_confirmation: string;
    created_at: string | null;
    updated_at: string | null;
    deleted_at: string | null;
}
type Filter = {
    column: string;
    operator: string;
    value: string;
}

export const createUserAPI = async (
  first_name: string,
  last_name: string,
  username: string,
  role: string,
  password: string,
) => {
  try {
    const { data } = await apiClient.post("/api/auth/create", {
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

export const fetchUsersApi = async (pageIndex: number, pageSize: number, searchQuery: string) => {
    try {
        const response = await apiClient.get(
            `/api/users?page=${pageIndex + 1}&per_page=${pageSize}&q=${searchQuery}`
        );
        const data = response.data.data;
        return { data: data, totalItems: response.data.meta.total };
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message || "An unexpected error occurred";

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

export const getUserColumnApi = async () => {
    try {
        const { data } = await apiClient.get("/api/users/get-columns");
        // Check if data is an object (received format)
        if (typeof data === "object" && !Array.isArray(data)) {
            return Object.values(data);//changing object data to array
        }
        if (!Array.isArray(data)) {
            throw new Error("Unexpected response format: data is not an array");
        }
        return data;
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message || "An unexpected error occurred";

        throw new Error(errorMessage);
    }
};

export const updateUserApi = async (
    id: string,
    name: string,
    email: string,
    username: string,
    gender_id: number,
    password: string,
    password_confirmation: string,
) => {
    try {
        const { data } = await apiClient.put(`/api/users/${id}`, {
            name,
            email,
            username,
            gender_id,
            password,
            password_confirmation,
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

export const softDeleteUserApi = async (id: string) => {
    try {
        const response = await apiClient.delete(`/api/users/${id}`);
        if (response.status == 204) {
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

export const syncRolesApi = async (userId: string, roleIds: number[]) => {
    try {
        const { data } = await apiClient.post(`/api/users/sync-roles/${userId}`, {
            role_ids: roleIds,
        });
        return data;
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message || "An unexpected error occurred";

        throw new Error(errorMessage);
    }
};

export const syncPermissionsApi = async (userId: string, permissionIds: number[]) => {
    try {
        const { data } = await apiClient.post(`/api/users/sync-permissions/${userId}`, {
            permission_ids: permissionIds,
        });
        return data;
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message || "An unexpected error occurred";

        throw new Error(errorMessage);
    }
};

export const assignCampusApi = async (userId: string, campusIds: number[]) => {
    try {
        const { data } = await apiClient.post(`/api/users/assign-campus/${userId}`, {
            campus_ids: campusIds,
        });
        return data;
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message || "An unexpected error occurred";

        throw new Error(errorMessage);
    }
};

export const filterUserApi = async (pageSize: number, filters: Filter[]) => {
    try {
        const { data } = await apiClient.post("/api/users/filter", {
            per_page: pageSize,
            filters: filters.filter((filter) => filter.column && filter.value),
        });
        if (!data || !Array.isArray(data.data)) {
            throw new Error("Unexpected response format: data is not in the expected structure");
        }
        return {
            filteredData: data.data,
            totalItems: data.totalItems,
        };
    } catch (error) {
        throw error;
    }
};

export const getTrashedUserApi = async (pageIndex: number, pageSize: number, searchQuery: string) => {
    try {
        const response = await apiClient.get(
            `/api/users/trash?page=${pageIndex + 1}&per_page=${pageSize}&q=${searchQuery}`
        );
        const data = response.data.data;
        return { data: data, totalItems: response.data.meta.total };
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message || "An unexpected error occurred";

        throw new Error(errorMessage);
    }
};

export const restoreUserApi = async (id: string) => {
    try {
        const response = await apiClient.post(`/api/users/restore/${id}`);
        if (response.status === 204) {
            return { id };
        }
        const data = response.data.data;
        return data;
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message || "An unexpected error occurred";

        throw new Error(errorMessage);
    }
};
