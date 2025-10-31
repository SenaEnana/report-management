import apiClient from "@/utils/ApiClient";
import * as XLSX from "xlsx";

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