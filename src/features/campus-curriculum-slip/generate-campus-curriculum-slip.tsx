import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { getSlipApi } from "@/services/SlipService";
import { getYearApi } from "@/services/YearService";
import { getSemesterApi } from "@/services/SemesterService";
import { getCampusCurriculumSlipByIdApi } from "@/services/CampusCurriculumSlipService";
import { getCampusCurriculumApi } from "@/services/CampusCurriculumService";

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

interface CampusCurriculum {
    id: number;
    name: string;
}

interface Slip {
    id: number;
    name: string;
}

interface Year {
    id: number;
    name: string;
}

interface Semester {
    id: number;
    year: number;
}

export default function GenerateCampusCurriculumSlip() {
    const { id } = useParams();
    const [campusCurriculumSlip, setCampusCurriculumSlip] = useState<CampusCurriculumSlip | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampusCurriculumSlip = async () => {
            try {
                if (!id) {
                    console.log("Campus Curriculum Slip ID is undefined");
                    return;
                }
                const response = await getCampusCurriculumSlipByIdApi(id);
                const data = response.data;
                setCampusCurriculumSlip({
                    ...data,
                    campus_curriculum_id: Number(data.campus_curriculum_id),
                    slip_id: Number(data.slip_id),
                    year_id: Number(data.year_id),
                    semester_id: Number(data.semester_id),
                    is_generated: Boolean(data.is_generated),
                });
            } catch (error) {
                console.error("Error fetching campus curriculum slip details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCampusCurriculumSlip();
    }, [id]);

    const { data: campusCurriculums } = useQuery({
        queryKey: ["campusCurriculums"],
        queryFn: getCampusCurriculumApi,
    });

    const { data: slips } = useQuery({
        queryKey: ["slips"],
        queryFn: getSlipApi,
    });

    const { data: years } = useQuery({
        queryKey: ["years"],
        queryFn: getYearApi,
    });

    const { data: semesters } = useQuery({
        queryKey: ["semesters"],
        queryFn: getSemesterApi,
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!campusCurriculumSlip) {
        return <div>Campus Curriculum not found.</div>;
    }

    const campusCurriculumName = campusCurriculums?.find((campus: CampusCurriculum) => campus.id === campusCurriculumSlip.campus_curriculum_id)?.name;
    const slipName = slips?.find((batchYear: Slip) => batchYear.id === campusCurriculumSlip.slip_id)?.year;
    const yearName = years?.find((admissionType: Year) => admissionType.id === campusCurriculumSlip.year_id)?.name;
    const semesterName = semesters?.find((curriculum: Semester) => curriculum.id === campusCurriculumSlip.semester_id)?.name;

    return (
        <div className="mb-4 m-4">
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-semibold">Campus Curriculum Name</TableCell>
                        <TableCell>{campusCurriculumName || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-semibold">Year Name</TableCell>
                        <TableCell>{yearName || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-semibold">Semester Name</TableCell>
                        <TableCell>{semesterName || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-semibold">Slip</TableCell>
                        <TableCell>{slipName || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-semibold">Is the Slip Generated</TableCell>
                        <TableCell>{campusCurriculumSlip.is_generated ? "Yes" : "No"}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-semibold">Remarks</TableCell>
                        <TableCell>{campusCurriculumSlip.remarks || "N/A"}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}
