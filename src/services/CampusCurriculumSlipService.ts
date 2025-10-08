import apiClient from "@/utils/ApiClient";

interface CampusCurriculumSlip {
    id: number;
    campus_curriculum_id: number;
    slip_id: number;
    year_id: number;
    semester_id: number;
    is_generated: boolean;
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

export const fetchCampusCurriculumSlipApi = async (pageIndex: number, pageSize: number, searchQuery: string) => {
    try {

        const response = await apiClient.get(
            `/api/campus-curriculum-slips?page=${pageIndex + 1}&per_page=${pageSize}&q=${searchQuery}`
        );
        const data = response.data.data;

        return { data: data, totalItems: response.data.meta.total };
    } catch (error: any) {
        console.error("Error on view campus curriculum slips:", error.message);
        const errorMessage =
            error.response?.data?.message || "An unexpected error occurred";

        throw new Error(errorMessage);
    }
};

export const getCampusCurriculumSlipApi = async () => {
    try {
        const { data } = await apiClient.get("/api/campus-curriculum-slips/get-all");

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

export const getCampusCurriculumSlipColumnApi = async () => {
    try {
        const { data } = await apiClient.get("/api/campus-curriculum-slips/get-columns");
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

export const updateCampusCurriculumSlipApi = async (
    id: string,
    campus_curriculum_id: number,
    slip_id: number,
    year_id: number,
    semester_id: number,
    is_generated: boolean,
    remarks: string,

) => {
    try {
        const { data } = await apiClient.put(`/api/campus-curriculum-slips/${id}`, {
            campus_curriculum_id,
            slip_id,
            year_id,
            semester_id,
            is_generated,
            remarks: remarks.trim() === "" ? null : remarks,
        });
        return data;
    } catch (error: any) {
        console.error("Error on updating batch year:", error.message);
        const errorMessage =
            error.response?.data?.message || "An unexpected error occurred";

        throw new Error(errorMessage);
    }
};

export async function getCampusCurriculumSlipByIdApi(id: string): Promise<{ data: CampusCurriculumSlip }> {
    try {
        const { data } = await apiClient.get(`/api/campus-curriculum-slips/${id}`);
        return data;
    } catch (error: any) {
        console.error("Error fetching batch-year details:", error.message);
        const errorMessage =
            error.response?.data?.message || "An unexpected error occurred";

        throw new Error(errorMessage);
    }
};

export const softDeleteCampusCurriculumSlipApi = async (id: string) => {
    try {
        const response = await apiClient.delete(`/api/campus-curriculum-slips/${id}`);
        if (response.status == 204) {
            return true;
        } else {
            return false;
        }
    } catch (error: any) {
        console.error("Error on delete batch year:", error.message);
        const errorMessage =
            error.response?.data?.message || "An unexpected error occurred";

        throw new Error(errorMessage);
    }
};

export const filterCampusCurriculumSlipApi = async (pageSize: number, filters: Filter[]) => {
    try {
        const { data } = await apiClient.post("/api/campus-curriculum-slips/filter", {
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

export const getTrashedCampusCurriculumSlipApi = async (pageIndex: number, pageSize: number, searchQuery: string) => {
    try {

        const response = await apiClient.get(
            `/api/campus-curriculum-slips/trash?page=${pageIndex + 1}&per_page=${pageSize}&q=${searchQuery}`
        );
        const data = response.data.data;

        return { data: data, totalItems: response.data.meta.total };
    } catch (error: any) {
        console.error("Error on view trashed batch years:", error.message);
        const errorMessage =
            error.response?.data?.message || "An unexpected error occurred";

        throw new Error(errorMessage);
    }
};

export const restoreCampusCurriculumSlipApi = async (id: string) => {
    try {
        const response = await apiClient.post(`/api/campus-curriculum-slips/restore/${id}`);
        if (response.status === 204) {
            return { id };
        }
        const data = response.data.data;
        return data;
    } catch (error: any) {
        console.error("Error on restore batch year:", error.message);
        const errorMessage =
            error.response?.data?.message || "An unexpected error occurred";

        throw new Error(errorMessage);
    }
};
