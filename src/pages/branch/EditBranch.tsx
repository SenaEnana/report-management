import PageWrapper from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BranchEditForm from "@/features/branch/branch-edit-form";

export default function EditBranch() {
  return (
    <PageWrapper>
      <Card>
        <CardHeader>
          <CardTitle>Update Branch</CardTitle>
        </CardHeader>
        <CardContent>
          <BranchEditForm />
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
