import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import PageWrapper from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserForm from "@/features/user/user-form";

export default function CreateUser() {
    const navigate = useNavigate();
    return (
        <PageWrapper>
            <Card>
                <CardHeader>
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <CardHeader>
                                <CardTitle>Create New User</CardTitle>
                            </CardHeader>
                            <Button
                                onClick={() => navigate("/user/view")}
                                className="bg-amber-500"
                            >
                                View User
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <UserForm />
                </CardContent>
            </Card>
        </PageWrapper>
    );
}
