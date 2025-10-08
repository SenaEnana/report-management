import PageWrapper from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import PermissionTable from "@/features/permission/permission-table";
import { useNavigate } from "react-router-dom";


export default function ViewPermission() {
    const navigate = useNavigate();
    return (
        <PageWrapper>
            <Card className="p-3">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <CardHeader>
                            <CardTitle>View Permissions</CardTitle>
                        </CardHeader>
                        <Button
                            onClick={() => navigate("/user/view")}
                            className="bg-amber-500 m-2"
                        >
                            Back
                        </Button>
                    </div>
                </div>
                <PermissionTable />
            </Card>
        </PageWrapper>
    );
}
