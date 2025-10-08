import apiClient from "@/utils/ApiClient";

interface ApplicantTransfer {
    id: number;
    applicant_id: number;
    transferd_from: string;
    transferd_date: string;
    year_id: number;
    semester_id: number;
    transfer_reason: string;
    remarks: string;
    created_at: string | null;
    updated_at: string | null;
    deleted_at: string | null;
}

type Filter = {
    column: string;
    operator: string;
    value: string;
};

export const fetchApplicantTransfers = async (pageIndex: number, pageSize: number, searchQuery: string) => {
    try {

        const response = await apiClient.get(
            `/api/applicant-transfers?page=${pageIndex + 1}&per_page=${pageSize}&q=${searchQuery}`
        );
        const data = response.data.data;

        return { data: data, totalItems: response.data.meta.total };
    } catch (error: any) {
        console.error("Error on view applicant degrees:", error.message);
        const errorMessage =
            error.response?.data?.message || "An unexpected error occurred";

        throw new Error(errorMessage);
    }
};

export const createApplicantTransferApi = async (
    applicant_id: number,
    transferd_from: string,
    transferd_date: string,
    year_id: number,
    semester_id: number,
    transfer_reason: string,
    remarks: string,
) => {
    try {
        const { data } = await apiClient.post("/api/applicant-transfers", {
            applicant_id,
            transferd_from,
            transferd_date,
            year_id,
            semester_id,
            transfer_reason,
            remarks,
        });

        return data;
    } catch (error: any) {
        console.error("Error on create applicant degree:", error.message);
        const errorMessage =
            error.response?.data?.message || "An unexpected error occurred";

        throw new Error(errorMessage);
    }
};

export const getApplicantTransferApi = async () => {
    try {
        const { data } = await apiClient.get("/api/applicant-transfers/get-all");

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

export const getApplicantTransferColumnApi = async () => {
    try {
        const { data } = await apiClient.get("/api/applicant-transfers/get-columns");
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

export const updateApplicantTransferApi = async (
    id: string,
    applicant_id: number,
    transferd_from: string,
    transferd_date: string,
    year_id: number,
    semester_id: number,
    transfer_reason: string,
    remarks: string,

) => {
    try {
        const { data } = await apiClient.put(`/api/applicant-transfers/${id}`, {
            applicant_id,
            transferd_from,
            transferd_date,
            year_id,
            semester_id,
            transfer_reason,
            remarks,
        });
        return data;
    } catch (error: any) {
        console.error("Error on updating applicant-degree:", error.message);
        const errorMessage =
            error.response?.data?.message || "An unexpected error occurred";

        throw new Error(errorMessage);
    }
};

export async function getApplicantTransferByIdApi(id: string): Promise<{ data: ApplicantTransfer }> {
    try {
        const { data } = await apiClient.get(`/api/applicant-transfers/${id}`);
        return data;
    } catch (error: any) {
        console.error("Error fetching applicant-degree details:", error.message);
        const errorMessage =
            error.response?.data?.message || "An unexpected error occurred";

        throw new Error(errorMessage);
    }
};

export const filterApplicantTransferApi = async (pageSize: number, filters: Filter[]) => {
    try {
        const { data } = await apiClient.post("/api/applicant-transfers/filter", {
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

export const softDeleteApplicantTransferApi = async (id: string) => {
    try {
        const response = await apiClient.delete(`/api/applicant-transfers/${id}`);
        if (response.status == 204) {
            return true;
        } else {
            return false;
        }
    } catch (error: any) {
        console.error("Error on delete applicant degree:", error.message);
        const errorMessage =
            error.response?.data?.message || "An unexpected error occurred";

        throw new Error(errorMessage);
    }
};

export const getTrashedApplicantTransferApi = async (pageIndex: number, pageSize: number, searchQuery: string) => {
    try {

        const response = await apiClient.get(
            `/api/applicant-transfers/trash?page=${pageIndex + 1}&per_page=${pageSize}&q=${searchQuery}`
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

export const restoreApplicantTransferApi = async (id: string) => {
    try {
        const response = await apiClient.post(`/api/applicant-transfers/restore/${id}`);
        if (response.status === 204) {
            return { id };
        }
        const data = response.data.data;
        return data;
    } catch (error: any) {
        console.error("Error on restore degree applicant:", error.message);
        const errorMessage =
            error.response?.data?.message || "An unexpected error occurred";

        throw new Error(errorMessage);
    }
};