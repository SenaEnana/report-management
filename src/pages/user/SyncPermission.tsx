import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import PageWrapper from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SyncPermissionForm from "@/features/user/sync-permission-form";

export default function SyncPermission() {
    const navigate = useNavigate();
    return (
        <PageWrapper>
            <Card>
                <CardHeader>
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <CardHeader>
                                <CardTitle>Sync Permission to User</CardTitle>
                            </CardHeader>
                            <Button
                                onClick={() => navigate("/user/view")}
                                className="bg-amber-500"
                            >
                                Back
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <SyncPermissionForm />
                </CardContent>
            </Card>
        </PageWrapper>
    );
}
