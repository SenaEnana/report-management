import apiClient from "@/utils/ApiClient";

interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}
type Filter = {
  column: string;
  operator: string;
  value: string;
};
export const createRoleApi = async (
  name: string,
  guard_name: string,

) => {
  try {
    const { data } = await apiClient.post("/api/roles", {
      name,
      guard_name,
    });
    return data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";

    throw new Error(errorMessage);
  }
};

export const fetchRoleApi = async (pageIndex: number, pageSize: number, searchQuery: string) => {
  try {
    const response = await apiClient.get(
      `/api/roles?page=${pageIndex + 1}&per_page=${pageSize}&q=${searchQuery}`
    );
    const data = response.data.data;
    return { data: data, totalItems: response.data.meta.total };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";

    throw new Error(errorMessage);
  }
};

export const getRoleApi = async () => {
  try {
    const { data } = await apiClient.get("/api/roles/get-all");
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

export const getRoleColumnApi = async () => {
  try {
    const { data } = await apiClient.get("/api/roles/get-columns");
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

export const updateRoleApi = async (
  id: string,
  name: string,
  guard_name: string,

) => {
  try {
    const { data } = await apiClient.put(`/api/roles/${id}`, {
      name,
      guard_name,
    });
    return data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";

    throw new Error(errorMessage);
  }
};

export async function getRoleByIdApi(id: string): Promise<{ data: Role }> {
  try {
    const { data } = await apiClient.get(`/api/roles/${id}`);
    return data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";

    throw new Error(errorMessage);
  }
};

export const softDeleteRoleApi = async (id: string) => {
  try {
    const response = await apiClient.delete(`/api/roles/${id}`);
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

export const filterRoleApi = async (pageSize: number, filters: Filter[]) => {
  try {
    const { data } = await apiClient.post("/api/roles/filter", {
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

////done by mistake to be checked later
// export const getTrashedRoleApi = async (pageIndex: number, pageSize: number, searchQuery: string) => {
//   try {
//     const response = await apiClient.get(
//       `/api/roles/trash?page=${pageIndex + 1}&per_page=${pageSize}&q=${searchQuery}`
//     );
//     const data = response.data.data;
//     return { data: data, totalItems: response.data.meta.total };
//   } catch (error: any) {
//     console.error("Error on view trashed roles:", error.message);
// const errorMessage =
// error.response?.data?.message || "An unexpected error occurred";

// throw new Error(errorMessage);
//   }
// };

// export const restoreRoleApi = async (id: string) => {
//   try {
//     const response = await apiClient.post(`/api/roles/restore/${id}`);
//     if (response.status === 204) {
//       return { id };
//     }
//     const data = response.data.data;
//     return data;
//   } catch (error: any) {
//     console.error("Error on restore role:", error.message);
// const errorMessage =
// error.response?.data?.message || "An unexpected error occurred";

// throw new Error(errorMessage);
//   }
// };
