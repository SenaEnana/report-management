import apiClient from "@/utils/ApiClient";
import * as XLSX from "xlsx";

export const uploadMerchantReportApi = async (file: File | undefined) => {
  if (!file) throw new Error("No file selected");

  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiClient.post("/api/reports", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    responseType: "blob",
  });

  // Convert blob -> JSON rows
  const blob = new Blob([data]);
  const arrayBuffer = await blob.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  // Save both blob URL + jsonData
  const url = window.URL.createObjectURL(blob);
  localStorage.setItem("lastMerchantReportUrl", url);
  localStorage.setItem("lastMerchantReportData", JSON.stringify(jsonData));

  return true;
};

export const uploadBranchReportApi = async (file: File | undefined) => {
  if (!file) throw new Error("No file selected");

  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiClient.post("/api/reports/branch ", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    responseType: "blob",
  });

  // Convert blob -> JSON rows
  const blob = new Blob([data]);
  const arrayBuffer = await blob.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  // Save both blob URL + jsonData
  const url = window.URL.createObjectURL(blob);
  localStorage.setItem("lastBranchReportUrl", url);
  localStorage.setItem("lastBranchReportData", JSON.stringify(jsonData));

  return true;
};

export const updateExxhangeRateApi = async (
  CUP: number,
  MC: number,
  VC: number,

) => {
  try {
    const { data } = await apiClient.put("/api/currency/update-all", {
      CUP,
      MC,
      VC,
    });
    return data;
  } catch (error: any) {
    console.error("Error on updating exchange rate:", error.message);
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";

    throw new Error(errorMessage);
  }
};
