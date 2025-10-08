import PageWrapper from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ApplicantEditForm from "@/features/applicants/applicant-edit-form";

export default function EditApplicant() {
  return (
    <PageWrapper>
      <Card>
        <CardHeader>
          <CardTitle>Update Applicant</CardTitle>
        </CardHeader>
        <CardContent>
          <ApplicantEditForm />
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
