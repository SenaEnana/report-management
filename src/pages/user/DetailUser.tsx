import PageWrapper from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import UserDetailPage from "@/features/user/user-detail-page";
import { useNavigate } from "react-router-dom";

export default function DetailUser() {
    const navigate = useNavigate();
    return (
        <PageWrapper>
            <Card>
                <div className="flex items-center justify-between">
                    <CardHeader>
                        <CardTitle>User Detail</CardTitle>
                    </CardHeader>
                </div>
                <UserDetailPage />
                <Button
                    onClick={() => navigate("/user/view")}
                    className="bg-teal-950 m-2 float-end"
                >
                    Back
                </Button>
            </Card>
        </PageWrapper>
    );
}