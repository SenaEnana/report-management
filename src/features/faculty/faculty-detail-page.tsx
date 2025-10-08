import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { getFacultyByIdApi } from "@/services/FacultyService";

interface Faculty {
  id: number;
  name: string;
  abbreviation: string;
  remarks: string;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

export default function FacultyDetailPage() {
  const { id } = useParams();
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        if (!id) {
          console.log("Faculty ID is undefined");
          return;
        }
        const response = await getFacultyByIdApi(id);
        setFaculty(response.data);
      } catch (error) {
        console.error("Error fetching Faculty details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!faculty) {
    return <div>faculty not found.</div>;
  }

  return (
    <div className="mb-4 m-4">
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-semibold">Faculty Name</TableCell>
            <TableCell>{faculty.name || "N/A"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Abbreviation</TableCell>
            <TableCell>{faculty.abbreviation || "N/A"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Remarks</TableCell>
            <TableCell>{faculty.remarks || "N/A"}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
