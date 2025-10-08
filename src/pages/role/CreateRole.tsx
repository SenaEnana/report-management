import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import PageWrapper from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RoleForm from "@/features/role/role-form";

export default function CreateRole() {
    const navigate = useNavigate();
    return (
        <PageWrapper>
            <Card>
                <CardHeader>
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <CardHeader>
                                <CardTitle>Create New Role</CardTitle>
                            </CardHeader>
                            <Button
                                onClick={() => navigate("/user/role/view")}
                                className="bg-amber-500"
                            >
                                View Role
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <RoleForm />
                </CardContent>
            </Card>
        </PageWrapper>
    );
}
