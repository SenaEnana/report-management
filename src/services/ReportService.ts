import apiClient from "@/utils/ApiClient";
import * as XLSX from "xlsx";
interface Report {
  id: number;
  file: undefined;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

type Filter = {
  column: string;
  operator: string;
  value: string;
};

export const fetchApplicants = async (pageIndex: number, pageSize: number, searchQuery: string) => {
  try {

    const response = await apiClient.get(
      `/api/applicants?page=${pageIndex + 1}&per_page=${pageSize}&q=${searchQuery}`
    );
    const data = response.data.data;

    return { data: data, totalItems: response.data.meta.total };
  } catch (error: any) {
    console.error("Error on view applicants:", error.message);
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";

    throw new Error(errorMessage);
  }
};

export const uploadReportApi = async (file: File | undefined) => {
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
  localStorage.setItem("lastReportUrl", url);
  localStorage.setItem("lastReportData", JSON.stringify(jsonData));

  return true;
};


////second correct and used for the separate download file on the other page
// export const uploadReportApi = async (file: File | undefined) => {
//   if (!file) throw new Error("No file selected");

//   const formData = new FormData();
//   formData.append("file", file);

//   const { data } = await apiClient.post("/api/reports", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//     responseType: "blob", // backend sends file directly
//   });

//   // Save blob as object URL in localStorage or context
//   const blob = new Blob([data]);
//   const url = window.URL.createObjectURL(blob);
//   localStorage.setItem("lastReportUrl", url);

//   return true;
// };

export const getApplicantApi = async () => {
  try {
    const { data } = await apiClient.get("/api/applicants/get-all");

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

export const getApplicantColumnApi = async () => {
  try {
    const { data } = await apiClient.get("/api/applicants/get-columns");
    if (!Array.isArray(data)) {
      throw new Error("Unexpected response format: data is not an array");
    }
    return data;
  } catch (error: any) {
    console.error("Error fetching columns:", error);
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";

    throw new Error(errorMessage);
  }
};

export const updateApplicantApi = async (
  id: string,
  first_name: string,
  middle_name: string,
  last_name: string,
  gender_id: number,
  phone_number: string,
  birth_date: string,
  campus_curriculum_id: number,
  is_transferred: boolean,
  remarks: string,

) => {
  try {
    const { data } = await apiClient.put(`/api/applicants/${id}`, {
      first_name,
      middle_name,
      last_name,
      gender_id,
      phone_number,
      birth_date,
      campus_curriculum_id,
      is_transferred,
      remarks,
    });
    return data;
  } catch (error: any) {
    console.error("Error on updating applicant:", error.message);
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";

    throw new Error(errorMessage);
  }
};

export async function getApplicantByIdApi(id: string): Promise<{ data: Report }> {
  try {
    const { data } = await apiClient.get(`/api/applicants/${id}`);
    return data;
  } catch (error: any) {
    console.error("Error fetching applicant details:", error.message);
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";

    throw new Error(errorMessage);
  }
};

export const filterApplicantApi = async (pageSize: number, filters: Filter[]) => {
  try {
    const { data } = await apiClient.post("/api/applicants/filter", {
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

export const softDeleteApplicantApi = async (id: string) => {
  try {
    const response = await apiClient.delete(`/api/applicants/${id}`);
    if (response.status == 204) {
      return true;
    } else {
      return false;
    }
  } catch (error: any) {
    console.error("Error on delete applicant:", error.message);
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";

    throw new Error(errorMessage);
  }
};

export const getTrashedApplicantApi = async (pageIndex: number, pageSize: number, searchQuery: string) => {
  try {

    const response = await apiClient.get(
      `/api/applicants/trash?page=${pageIndex + 1}&per_page=${pageSize}&q=${searchQuery}`
    );
    const data = response.data.data;

    return { data: data, totalItems: response.data.meta.total };
  } catch (error: any) {
    console.error("Error on view trashed admission types:", error.message);
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";

    throw new Error(errorMessage);
  }
};

export const restoreApplicantApi = async (id: string) => {
  try {
    const response = await apiClient.post(`/api/applicants/restore/${id}`);
    if (response.status === 204) {
      return { id };
    }
    const data = response.data.data;
    return data;
  } catch (error: any) {
    console.error("Error on restore academic year:", error.message);
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";

    throw new Error(errorMessage);
  }
};