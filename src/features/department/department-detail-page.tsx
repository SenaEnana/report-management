import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { getDepartmentByIdApi } from "@/services/DepartmentService";
import { useQuery } from "@tanstack/react-query";
import { getFacultiesApi } from "@/services/FacultyService";

interface Department {
  id: number;
  faculty_id: number;
  name: string;
  abbreviation: string;
  remarks: string;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

interface Faculty {
  id: number;
  name: string;
}

export default function DepartmentDetailPage() {
  const { id } = useParams();
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        if (!id) {
          console.error("Department ID is undefined.");
          return;
        }
        const response = await getDepartmentByIdApi(id);
        setDepartment(response.data);
      } catch (error) {
        console.error("Error fetching department details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [id]);

  const { data: faculties } = useQuery({
    queryKey: ["faculties"],
    queryFn: getFacultiesApi,
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!department) {
    return <div>Department not found.</div>;
  }

  const facultyName = faculties?.find((faculty: Faculty) => faculty.id === department.faculty_id)?.name;

  return (
    <div className="mb-4 m-4">
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-semibold">Department Name</TableCell>
            <TableCell>{department.name || "N/A"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Abbreviation</TableCell>
            <TableCell>{department.abbreviation || "N/A"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Remarks</TableCell>
            <TableCell>{department.remarks || "N/A"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Faculty</TableCell>
            <TableCell>{facultyName || "N/A"}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
