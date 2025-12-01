import apiClient from "@/utils/ApiClient";

export const fetchMissedTerminalTransactionApi = async () => {
  try {
    const response = await apiClient.get("/api/export/missing-transactions");
    const data = response.data;
    return { data, totalItems: data.length };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
};

export const fetchMissedBranchTransactionApi = async () => {
  try {
    const response = await apiClient.get("/api/export/missing-branch-transaction-dates");
    const data = response.data;
    return { data, totalItems: data.length };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
};