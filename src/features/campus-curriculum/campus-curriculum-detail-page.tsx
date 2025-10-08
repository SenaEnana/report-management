import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { getCampusCurriculumByIdApi } from "@/services/CampusCurriculumService";
import { getCampusApi } from "@/services/CampusService";
import { getBatchYearApi } from "@/services/BatchYearService";
import { getAdmissionTypeApi } from "@/services/AdmissionTypeService";
import { getCurriculumApi } from "@/services/CurriculumService";

interface CampusCurriculum {
  id: number;
  campus_id: number;
  curriculum_id: number;
  admission_type_id: number;
  batch_year_id: number;
  total_year: number;
  total_semester: number;
  semester_per_year: number;
  remarks: string;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

interface Campus {
  id: number;
  name: string;
}

interface Curriculum {
  id: number;
  name: string;
}

interface AdmissionType {
  id: number;
  name: string;
}

interface BatchYear {
  id: number;
  year: number;
}

export default function CampusCurriculumDetailPage() {
  const { id } = useParams();
  const [campusCurriculum, setCampusCurriculum] = useState<CampusCurriculum | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampusCurriculum = async () => {
      try {
        if (!id) {
          console.log("CampusCurriculum ID is undefined");
          return;
        }
        const response = await getCampusCurriculumByIdApi(id);
        const data = response.data;
        setCampusCurriculum({
          ...data,
          campus_id: Number(data.campus_id),
          curriculum_id: Number(data.curriculum_id),
          admission_type_id: Number(data.admission_type_id),
          batch_year_id: Number(data.batch_year_id),
          total_year: Number(data.total_year),
          total_semester: Number(data.total_semester),
          semester_per_year: Number(data.semester_per_year),
        });
      } catch (error) {
        console.error("Error fetching campus curriculum details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampusCurriculum();
  }, [id]);

  const { data: campuses } = useQuery({
    queryKey: ["campuses"],
    queryFn: getCampusApi,
  });

  const { data: batchYears } = useQuery({
    queryKey: ["batchYears"],
    queryFn: getBatchYearApi,
  });

  const { data: admissionTypes } = useQuery({
    queryKey: ["admissionTypes"],
    queryFn: getAdmissionTypeApi,
  });

  const { data: curriculums } = useQuery({
    queryKey: ["curriculums"],
    queryFn: getCurriculumApi,
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!campusCurriculum) {
    return <div>Campus Curriculum not found.</div>;
  }

  const campusName = campuses?.find((campus: Campus) => campus.id === campusCurriculum.campus_id)?.name;
  const batchYearName = batchYears?.find((batchYear: BatchYear) => batchYear.id === campusCurriculum.batch_year_id)?.year;
  const admissionTypeName = admissionTypes?.find((admissionType: AdmissionType) => admissionType.id === campusCurriculum.admission_type_id)?.name;
  const curriculumName = curriculums?.find((curriculum: Curriculum) => curriculum.id === campusCurriculum.curriculum_id)?.name;

  return (
    <div className="mb-4 m-4">
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-semibold">Campus Name</TableCell>
            <TableCell>{campusName || "N/A"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Admission Type</TableCell>
            <TableCell>{admissionTypeName || "N/A"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Curriculum</TableCell>
            <TableCell>{curriculumName || "N/A"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Batch Year</TableCell>
            <TableCell>{batchYearName || "N/A"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Total Year</TableCell>
            <TableCell>{campusCurriculum.total_year || "N/A"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Total Semester</TableCell>
            <TableCell>{campusCurriculum.total_semester || "N/A"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Semester Per Year</TableCell>
            <TableCell>{campusCurriculum.semester_per_year || "N/A"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Remarks</TableCell>
            <TableCell>{campusCurriculum.remarks || "N/A"}</TableCell>
          </TableRow>

        </TableBody>
      </Table>
    </div>
  );
}
