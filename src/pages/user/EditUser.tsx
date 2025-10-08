import PageWrapper from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserEditForm from "@/features/user/user-edit-form";

export default function EditUser() {
    return (
        <PageWrapper>
            <Card>
                <CardHeader>
                    <CardTitle>Update User</CardTitle>
                </CardHeader>
                <CardContent>
                    <UserEditForm />
                </CardContent>
            </Card>
        </PageWrapper>
    );
}
