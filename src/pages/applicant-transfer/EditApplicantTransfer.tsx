import PageWrapper from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ApplicantTransferEditForm from "@/features/applicant-transfer/applicant-transfer-edit-form";

export default function EditApplicantTransfer() {
    return (
        <PageWrapper>
            <Card>
                <CardHeader>
                    <CardTitle>Update Transfer Applicant</CardTitle>
                </CardHeader>
                <CardContent>
                    <ApplicantTransferEditForm />
                </CardContent>
            </Card>
        </PageWrapper>
    );
}
