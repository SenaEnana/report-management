import PageWrapper from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import ApplicantTransferGetTrash from "@/features/applicant-transfer/applicant-transfer-get-trash";

export default function GetTrashApplicantTransfer() {
    const navigate = useNavigate();
    return (
        <PageWrapper>
            <Card>
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <CardHeader>
                            <CardTitle>Trashed Resources</CardTitle>
                        </CardHeader>
                        <Button
                            onClick={() => navigate("/applicant/applicant-transfer/view")}
                            className="bg-amber-500 m-2">
                            Back
                        </Button>
                    </div>
                </div>
                <ApplicantTransferGetTrash />
            </Card>
        </PageWrapper>
    );
}
