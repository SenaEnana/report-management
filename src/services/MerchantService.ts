import apiClient from "@/utils/ApiClient";
import * as XLSX from "xlsx";

export const createMerchantApi = async (
  terminal_code: string,
  merchant_name: string,
  branch_id: number,
) => {
  try {
    const { data } = await apiClient.post("/api/terminals", {
      terminal_code,
      merchant_name,
      branch_id,
    });
    return data;
  } catch (error: any) {
    console.error("Error on create terminals:", error.message);
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";

    throw new Error(errorMessage);
  }
};

export const fetchTerminalApi = async () => {
  try {
    const response = await apiClient.get("/api/terminals");
    const data = response.data;
    return { data, totalItems: data.length };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
};

export const updateMerchantApi = async (
    id: string,
    merchant_name: string,
    // terminal_code: string,
    branch_id: number,
) => {
    try {
        const { data } = await apiClient.put(`/api/terminals/${id}`, {
            merchant_name,
            // terminal_code,
            branch_id,
        });
        return data;
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message || "An unexpected error occurred";

        throw new Error(errorMessage);
    }
};

export const softDeleteMerchantApi = async (terminal_id: string) => {
    try {
        const response = await apiClient.delete(`/api/terminals/${terminal_id}`);
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


//top ten merchant display
export const fetchMerchantsApi = async (pageIndex: number, pageSize: number, searchQuery: string) => {
  try {
    const response = await apiClient.get(
      `/api/export/top-merchants?page=${pageIndex + 1}&per_page=${pageSize}&q=${searchQuery}`,
      { responseType: "blob" }
    );

    // Convert Blob → ArrayBuffer
    const arrayBuffer = await response.data.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const jsonData: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // optional: store or preview file if needed
    const blobUrl = window.URL.createObjectURL(response.data);
    localStorage.setItem("TopTransactionMerchantUrl", blobUrl);
    localStorage.setItem("TopTransactionMerchantData", JSON.stringify(jsonData));

    // Return parsed JSON rows
    return { data: jsonData, totalItems: jsonData.length };
  } catch (error: any) {
    console.error("Error on view merchants:", error.message);
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
};

export const downloadTopMerchantApi = async () => {
  try {
    const response = await apiClient.get("/api/export/top-merchants", {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    const fileName = `top_10_merchants_${new Date()
      .toISOString()
      .split("T")[0]}.xlsx`;

    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    console.error("Error downloading top ten merchants:", error);
    const message =
      error.response?.data?.message ||
      "Failed to download top ten merchants.";
    throw new Error(message);
  }
};

export const merchantHistoryApi = async (pageIndex: number, pageSize: number, searchQuery: string) => {
  try {
    const response = await apiClient.get(
      `/api/export/merchant-history?page=${pageIndex + 1}&per_page=${pageSize}&q=${searchQuery}`,
      { responseType: "blob" }
    );

    // Convert Blob → ArrayBuffer
    const arrayBuffer = await response.data.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const jsonData: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // optional: store or preview file if needed
    const blobUrl = window.URL.createObjectURL(response.data);
    localStorage.setItem("MerchantHistoryUrl", blobUrl);
    localStorage.setItem("MerchantHistoryData", JSON.stringify(jsonData));

    // Return parsed JSON rows
    return { data: jsonData, totalItems: jsonData.length };
  } catch (error: any) {
    console.error("Error on view merchants history:", error.message);
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
};


export const downloadAllMerchantHistoryApi = async () => {
  try {
    const response = await apiClient.get("/api/export/merchant-history", {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    const fileName = `merchant_transaction_history_${new Date()
      .toISOString()
      .split("T")[0]}.xlsx`;

    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    console.error("Error downloading all merchant history:", error);
    const message =
      error.response?.data?.message ||
      "Failed to download full merchant history.";
    throw new Error(message);
  }
};

export const downloadFilteredMerchantHistoryApi = async (
  terminal_code: string,
  from: string,
  to: string
) => {
  try {
    const response = await apiClient.get(
      `/api/export/merchant-history/date`,
      {
        params: { terminal_code, from, to },
        responseType: "blob", 
      }
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    const fileName = `merchant_history_${terminal_code}_${from}_to_${to}.xlsx`;
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error: any) {
    console.error("Error downloading merchant history by date:", error);
    const message =
      error.response?.data?.message || "Failed to download merchant history.";
    throw new Error(message);
  }
};

