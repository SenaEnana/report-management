import apiClient from "@/utils/ApiClient";

export const fetchActiveCountsApi = async () => {
  try {
    const { data } = await apiClient.get("/summary/active-counts");
    return data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch active counts";

    throw new Error(errorMessage);
  }
};
