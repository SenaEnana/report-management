import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { getUserByIdApi } from "@/services/UserService";
import { useQuery } from "@tanstack/react-query";
import { getGenderApi } from "@/services/GenderService";

interface Role {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    guard_name: string;
    pivot?: {
        model_type: string;
        model_id: number;
        role_id: number;
    };
}
interface Campus {
    id: number;
    name: string;
}

interface Gender {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    username: string;
    gender_id: number;
    password: string;
    password_confirmation: string;
    created_at: string | null;
    updated_at: string | null;
    deleted_at: string | null;
    roles: Role[];
    campuses: Campus[];
}

export default function UserDetailPage() {
    const { id } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const { data: genders } = useQuery({
        queryKey: ["genders"],
        queryFn: getGenderApi,
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (!id) {
                    console.log("User ID is undefined");
                    return;
                }
                const response = await getUserByIdApi(id);
                console.log("Fetched user data:", response.data);

                const userData = {
                    ...response.data,
                    gender_id: Number(response.data.gender_id),
                    roles: Array.isArray(response.data.roles) ? response.data.roles : [],
                };
                setUser(userData);
            } catch (error) {
                console.error("Error fetching user details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);


    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>user not found.</div>;
    }
    const genderName = genders?.find((gender: Gender) => gender.id === user.gender_id)?.name;
    return (
        <div className="mb-4 m-4">
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-semibold">Name</TableCell>
                        <TableCell>{user.name || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-semibold">Email</TableCell>
                        <TableCell>{user.email || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-semibold">Username</TableCell>
                        <TableCell>{user.username || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-semibold">Gender</TableCell>
                        <TableCell>{genderName || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-semibold">Roles</TableCell>
                        <TableCell>
                            {user.roles.length > 0 ? (
                                <ul>
                                    {user.roles.map((role) => (
                                        <li key={role.id}>{role.name}</li>
                                    ))}
                                </ul>
                            ) : (
                                "No role assigned"
                            )}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-semibold">Campus</TableCell>
                        <TableCell>
                            {user.campuses.length > 0 ? (
                                <ul>
                                    {user.campuses.map((campus) => (
                                        <li key={campus.id}>{campus.name}</li>
                                    ))}
                                </ul>
                            ) : (
                                "No campus assigned"
                            )}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}
