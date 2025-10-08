import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { getApplicantTransferByIdApi } from "@/services/ApplicantTransferService";
import { getApplicantApi } from "@/services/ApplicantsService";
import { getYearApi } from "@/services/YearService";
import { getSemesterApi } from "@/services/SemesterService";

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

interface Applicant {
    id: number;
    name: string;
}
interface Year {
    id: number;
    name: string;
}
interface Semester {
    id: number;
    name: string;
}

export default function ApplicantTransferDetailPage() {
    const { id } = useParams();
    const [applicantTransfer, setApplicantTransfer] = useState<ApplicantTransfer | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplicantTransfer = async () => {
            try {
                if (!id) {
                    console.log("Applicant ID is undefined");
                    return;
                }
                const response = await getApplicantTransferByIdApi(id);
                setApplicantTransfer(response.data);
            } catch (error) {
                console.error("Error fetching applicant details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplicantTransfer();
    }, [id]);

    const { data: applicants } = useQuery({
        queryKey: ["applicants"],
        queryFn: getApplicantApi,
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

    if (!applicantTransfer) {
        return <div>Applicant not found.</div>;
    }

    const applicantName = applicants?.find((applicant: Applicant) => applicant.id === applicantTransfer.applicant_id)?.name;
    const yearName = years?.find((year: Year) => year.id === applicantTransfer.year_id)?.name;
    const semesterName = semesters?.find((semester: Semester) => semester.id === applicantTransfer.semester_id)?.name;

    return (
        <div className="mb-4 m-4">
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-semibold">Applicant Name</TableCell>
                        <TableCell>{applicantName || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-semibold">Transfer Place</TableCell>
                        <TableCell>{applicantTransfer.transferd_from || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-semibold">Transfer Date</TableCell>
                        <TableCell>{applicantTransfer.transferd_date || "N/A"}</TableCell>
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
                        <TableCell className="font-semibold">Transfer Reason</TableCell>
                        <TableCell>{applicantTransfer.transfer_reason || "N/A"}</TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className="font-semibold">Remarks</TableCell>
                        <TableCell>{applicantTransfer.remarks || "N/A"}</TableCell>
                    </TableRow>

                </TableBody>
            </Table>
        </div>
    );
}
