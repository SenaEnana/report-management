import PageWrapper from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RoleEditForm from "@/features/role/role-edit-form";

export default function EditRole() {
    return (
        <PageWrapper>
            <Card>
                <CardHeader>
                    <CardTitle>Update Role</CardTitle>
                </CardHeader>
                <CardContent>
                    <RoleEditForm />
                </CardContent>
            </Card>
        </PageWrapper>
    );
}
