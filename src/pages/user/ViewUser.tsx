import PageWrapper from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import UserTable from "@/features/user/user-table";
import { useNavigate } from "react-router-dom";


export default function ViewUser() {
    const navigate = useNavigate();
    return (
        <PageWrapper>
            <Card className="p-3">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <CardHeader>
                            <CardTitle>View Users</CardTitle>
                        </CardHeader>
                        <Button
                            onClick={() => navigate("/user/create")}
                            className="bg-amber-500 m-2"
                        >
                            Create User
                        </Button>
                    </div>
                </div>
                <UserTable />
            </Card>
        </PageWrapper>
    );
}
