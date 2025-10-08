import PageWrapper from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import RoleDetailPage from "@/features/role/role-detail-page";
import { useNavigate } from "react-router-dom";

export default function DetailRole() {
    const navigate = useNavigate();
    return (
        <PageWrapper>
            <Card>
                <div className="flex items-center justify-between">
                    <CardHeader>
                        <CardTitle>Role Detail</CardTitle>
                    </CardHeader>
                </div>
                <RoleDetailPage />
                <Button
                    onClick={() => navigate("/user/role/view")}
                    className="bg-teal-950 m-2 float-end"
                >
                    Back
                </Button>
            </Card>
        </PageWrapper>
    );
}