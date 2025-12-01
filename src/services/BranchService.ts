import apiClient from "@/utils/ApiClient";
import * as XLSX from "xlsx";

export const createBranchAPI = async (
  branch_name: string,
  district_id: number,
) => {
  try {
    const { data } = await apiClient.post("/api/branches", {
        branch_name,
        district_id
    });
    return data;
  } catch (error: any) {
    console.error("Error on creating branch:", error.message);
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";

    throw new Error(errorMessage);
  }
};

export const fetchBranchApi = async () => {
  try {
    const response = await apiClient.get("/api/branches");
    const data = response.data; // Directly get the array
    return { data, totalItems: data.length };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
};

export const updateBranchApi = async (
    branch_id: string,
    branch_name: string,
    district_id: number,
) => {
    try {
        const { data } = await apiClient.put(`/api/branches/${branch_id}`, {
            branch_name,
            district_id,
        });
        return data;
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message || "An unexpected error occurred";

        throw new Error(errorMessage);
    }
};

export const softDeleteBranchApi = async (branch_id: string) => {
    try {
        const response = await apiClient.delete(`/api/branches/${branch_id}`);
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

export const downloadBranchesApi = async () => {
  try {
    const response = await apiClient.get("/api/branches/download", {
      responseType: "blob",
    });
    console.log("Blob response:", response);

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "branches.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    console.error("❌ Error downloading branches:", error);
    const message =
      error.response?.data?.message || "Failed to download branches.";
    throw new Error(message);
  }
};

export const branchHistoryApi = async (pageIndex: number, pageSize: number, searchQuery: string) => {
  try {
    const response = await apiClient.get(
      `/api/export/branch-history?page=${pageIndex + 1}&per_page=${pageSize}&q=${searchQuery}`,
      { responseType: "blob" }
    );

    // Convert Blob → ArrayBuffer
    const arrayBuffer = await response.data.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const jsonData: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // optional: store or preview file if needed
    const blobUrl = window.URL.createObjectURL(response.data);
    localStorage.setItem("BranchHistoryUrl", blobUrl);
    localStorage.setItem("BranchHistoryData", JSON.stringify(jsonData));

    // Return parsed JSON rows
    return { data: jsonData, totalItems: jsonData.length };
  } catch (error: any) {
    console.error("Error on view branches history:", error.message);
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
};

export const downloadAllBranchHistoryApi = async () => {
  try {
    const response = await apiClient.get("/api/export/branch-history", {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    const fileName = `branch_transaction_history_${new Date()
      .toISOString()
      .split("T")[0]}.xlsx`;

    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    console.error("Error downloading all branch history:", error);
    const message =
      error.response?.data?.message ||
      "Failed to download full branch history.";
    throw new Error(message);
  }
};