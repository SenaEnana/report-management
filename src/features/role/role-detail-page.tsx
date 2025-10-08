import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { getRoleByIdApi } from "@/services/RoleService";

interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string | null;
    updated_at: string | null;
    deleted_at: string | null;
}

export default function RoleDetailPage() {
    const { id } = useParams();
    const [role, setRole] = useState<Role | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRole = async () => {
            try {
                if (!id) {
                    console.log("Role ID is undefined");
                    return;
                }
                const response = await getRoleByIdApi(id);
                setRole(response.data);
            } catch (error) {
                console.error("Error fetching Role:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRole();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!role) {
        return <div>Role not found.</div>;
    }

    return (
        <div className="mb-4 m-4">
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-semibold">Role Name</TableCell>
                        <TableCell>{role.name || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-semibold">Guard Name</TableCell>
                        <TableCell>{role.guard_name || "N/A"}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}    