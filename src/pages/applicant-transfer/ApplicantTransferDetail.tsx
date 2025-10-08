import PageWrapper from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import ApplicantTransferDetailPage from "@/features/applicant-transfer/applicant-transfer-detail-page";
import { useNavigate } from "react-router-dom";

export default function ApplicantTransferDetail() {
    const navigate = useNavigate();
    return (
        <PageWrapper>
            <Card>
                <div className="flex items-center justify-between">
                    <CardHeader>
                        <CardTitle>Applicant Transfer Detail</CardTitle>
                    </CardHeader>
                </div>
                <ApplicantTransferDetailPage />
                <Button
                    onClick={() => navigate("/applicant/applicant-transfer/view")}
                    className="bg-teal-950 m-2 float-end"
                >
                    Back
                </Button>
            </Card>
        </PageWrapper>
    );
}