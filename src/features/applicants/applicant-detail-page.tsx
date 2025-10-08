import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { getGenderApi } from "@/services/GenderService";
import { getCampusCurriculumApi } from "@/services/CampusCurriculumService";
import { getApplicantByIdApi } from "@/services/ApplicantsService";

interface Applicant {
    id: number;
    first_name: string;
    middle_name: string;
    last_name: string;
    gender_id: number;
    phone_number: string;
    birth_date: string;
    campus_curriculum_id: number;
    is_transferred: boolean;
    remarks: string;
    created_at: string | null;
    updated_at: string | null;
    deleted_at: string | null;
}

interface Gender {
    id: number;
    name: string;
}

interface CampusCurriculum {
    id: number;
    name: string;
}

export default function ApplicantDetailPage() {
    const { id } = useParams();
    const [applicant, setApplicant] = useState<Applicant | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplicant = async () => {
            try {
                if(!id){
                    console.log("Applicant ID is undefined");
                    return;
                }
                const response = await getApplicantByIdApi(id);
                setApplicant(response.data);
            } catch (error) {
                console.error("Error fetching applicant details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplicant();
    }, [id]);

    const { data: genders } = useQuery({
        queryKey: ["genders"],
        queryFn: getGenderApi,
    });

    const { data: campusCurriculums } = useQuery({
        queryKey: ["campusCurriculums"],
        queryFn: getCampusCurriculumApi,
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!applicant) {
        return <div>Applicant not found.</div>;
    }

    const genderName = genders?.find((gender: Gender) => gender.id === applicant.gender_id)?.name;
    const campusCurriculumName = campusCurriculums?.find((campusCurriculum: CampusCurriculum) => campusCurriculum.id === applicant.campus_curriculum_id)?.name;

    return (
        <div className="mb-4 m-4">
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-semibold">First Name</TableCell>
                        <TableCell>{applicant.first_name || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-semibold">Middle Name</TableCell>
                        <TableCell>{applicant.middle_name || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-semibold">Last Name</TableCell>
                        <TableCell>{applicant.last_name || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-semibold">Gender</TableCell>
                        <TableCell>{genderName || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-semibold">Phone Number</TableCell>
                        <TableCell>{applicant.phone_number || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-semibold">Birth Date</TableCell>
                        <TableCell>{applicant.birth_date || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-semibold">Campus Curriculum Name</TableCell>
                        <TableCell>{campusCurriculumName || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-semibold">Is Applicant Transferred</TableCell>
                        <TableCell>{applicant.is_transferred ? "Yes" : "No"}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-semibold">Remarks</TableCell>
                        <TableCell>{applicant.remarks || "N/A"}</TableCell>
                    </TableRow>

                </TableBody>
            </Table>
        </div>
    );
}
