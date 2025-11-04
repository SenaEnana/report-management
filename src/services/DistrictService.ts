import apiClient from "@/utils/ApiClient";

export const createDistrictAPI = async (
  district_name: string,
) => {
  try {
    const { data } = await apiClient.post("/api/districts", {
        district_name,
    });
    return data;
  } catch (error: any) {
    console.error("Error on creating district:", error.message);
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";

    throw new Error(errorMessage);
  }
};

export const fetchDistrictApi = async () => {
  try {
    const response = await apiClient.get("/api/districts");
    const data = response.data; // Directly get the array
    return { data, totalItems: data.length };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
};

export const updateDistrictApi = async (
    district_id: string,
    district_name: string,
) => {
    try {
        const { data } = await apiClient.put(`/api/districts/${district_id}`, {
            district_name,
        });
        return data;
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message || "An unexpected error occurred";

        throw new Error(errorMessage);
    }
};

export const softDeleteDistrictApi = async (district_id: string) => {
    try {
        const response = await apiClient.delete(`/api/districts/${district_id}`);
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

export const downloadDistrictsApi = async () => {
  try {
    const response = await apiClient.get("/api/districts/download", {
      responseType: "blob",
    });

    const disposition = response.headers["content-disposition"];
    let fileName = "districts.xlsx";
    if (disposition && disposition.includes("filename=")) {
      fileName = disposition
        .split("filename=")[1]
        .replace(/["']/g, "")
        .trim();
    }

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    console.error("Error downloading districts:", error);
    const message =
      error.response?.data?.message || "Failed to download districts.";
    throw new Error(message);
  }
};