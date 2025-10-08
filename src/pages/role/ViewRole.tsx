import PageWrapper from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import RoleTable from "@/features/role/role-table";
import { useNavigate } from "react-router-dom";


export default function ViewRole() {
    const navigate = useNavigate();
    return (
        <PageWrapper>
            <Card className="p-3">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <CardHeader>
                            <CardTitle>View Roles</CardTitle>
                        </CardHeader>
                        <Button
                            onClick={() => navigate("/user/role/view/create")}
                            className="bg-amber-500 m-2"
                        >
                            Create Role
                        </Button>
                    </div>
                </div>
                <RoleTable />
            </Card>
        </PageWrapper>
    );
}
