import PageWrapper from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import UserGetTrash from "@/features/user/user-get-trash";
import { useNavigate } from "react-router-dom";

export default function GetTrashUser() {
    const navigate = useNavigate();
    return (
        <PageWrapper>
            <Card>
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <CardHeader>
                            <CardTitle>Trashed Resources</CardTitle>
                        </CardHeader>
                        <Button onClick={() => navigate("/user/view")} className="bg-amber-500 m-2">View Users</Button>
                    </div>
                </div>
                <UserGetTrash />
            </Card>
        </PageWrapper>
    );
}
