import apiClient from "@/utils/ApiClient";

type Filter = {
  column: string;
  operator: string;
  value: string;
};

export const fetchUserPermissionsApi = async (pageIndex: number, pageSize: number, searchQuery: string) => {
  try {
    const response = await apiClient.get(
      `/api/permissions?page=${pageIndex + 1}&per_page=${pageSize}&q=${searchQuery}`
    );
    const data = response.data.data;
    console.log("data from response is:", response.data);
    return { data: data, totalItems: response.data.meta.total };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";

    throw new Error(errorMessage);
  }
};

export const getPermissionApi = async () => {
  try {
    const { data } = await apiClient.get("/api/permissions/get-all");

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

export const getPermissionColumnApi = async () => {
  try {
    const { data } = await apiClient.get("/api/permissions/get-columns");
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

//to be checked later 
export const filterPermissionApi = async (pageSize: number, filters: Filter[]) => {
  try {
    const { data } = await apiClient.post("/api/permissions/filter", {
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