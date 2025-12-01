import apiClient from "@/utils/ApiClient";
import * as XLSX from "xlsx";

export const uploadMerchantReportApi = async (
  file: File | undefined,
  transaction_date: string
) => {
  if (!file) throw new Error("No file selected");
  if (!transaction_date) throw new Error("Transaction date is required");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("transaction_date", transaction_date); 

  const { data } = await apiClient.post("/api/reports", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    responseType: "blob",
  });

  // Convert blob → JSON rows
  const blob = new Blob([data]);
  const arrayBuffer = await blob.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  // Keep the same date the user selected
  const processedData = jsonData.map((row: any) => ({
    ...row,
    transaction_date,
  }));

  // Save blob URL + data
  const url = window.URL.createObjectURL(blob);
  localStorage.setItem("lastMerchantReportUrl", url);
  localStorage.setItem("lastMerchantReportData", JSON.stringify(processedData));

  return true;
};



// export const uploadMerchantReportApi = async (file: File | undefined) => {
//   if (!file) throw new Error("No file selected");

//   const formData = new FormData();
//   formData.append("file", file);

//   const { data } = await apiClient.post("/api/reports", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//     responseType: "blob",
//   });

//   // Convert blob -> JSON rows
//   const blob = new Blob([data]);
//   const arrayBuffer = await blob.arrayBuffer();
//   const workbook = XLSX.read(arrayBuffer, { type: "array" });
//   const sheetName = workbook.SheetNames[0];
//   const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

//   // Save both blob URL + jsonData
//   const url = window.URL.createObjectURL(blob);
//   localStorage.setItem("lastMerchantReportUrl", url);
//   localStorage.setItem("lastMerchantReportData", JSON.stringify(jsonData));

//   return true;
// };

export const uploadBranchReportApi = async (file: File | undefined) => {
  if (!file) throw new Error("No file selected");

  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiClient.post("/api/reports/branch", formData, {
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
  date: string,

) => {
  try {
    const { data } = await apiClient.put("/api/currency/update-all", {
      CUP,
      MC,
      VC,
      date,
    });
    return data;
  } catch (error: any) {
    console.error("Error on updating exchange rate:", error.message);
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";

    throw new Error(errorMessage);
  }
};

export const downloadMergedBranchApi = async () => {
  try {
    const response = await apiClient.post("/api/reports/branch", {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    const fileName = `daily_branch_pos_performance_${new Date()
      .toISOString()
      .split("T")[0]}.xlsx`;

    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    console.error("Error downloading merged branch report:", error);
    const message =
      error.response?.data?.message ||
      "Failed to download merged branch report.";
    throw new Error(message);
  }
};

// 1. http://172.24.111.254:5000/api/reports-----> here transaction_date is required--////done
// 2. http://172.24.111.254:5000/api/currency-----> here date is required///done
// 3. http://172.24.111.254:5000 /api/export/missing-transactions--------->get method it display list of date missed////done 
// 4.http://172.24.111.254:5000 /all-merchant-history-date -----> use get method and pass from and to date parameter as query/////done
// 5. http://172.24.111.254:5000/top-merchants_txn----> list top 10 merchant by transaction number////done
// 6. http://172.24.111.254:5000/top-merchants_amount---------> list top 10 merchant by transaction amount////done


// 7.http://172.24.111.254:5000/summary/active-counts-----------> get data for number of pos, district and branch