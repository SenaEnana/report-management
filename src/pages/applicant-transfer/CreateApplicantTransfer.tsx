import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import PageWrapper from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ApplicantTransferForm from "@/features/applicant-transfer/applicant-transfer-form";

export default function CreateApplicantTransfer() {
    const navigate = useNavigate();
    return (
        <PageWrapper>
            <Card>
                <CardHeader>
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <CardHeader>
                                <CardTitle>Create Applicant Transfer</CardTitle>
                            </CardHeader>
                            <Button
                                onClick={() => navigate("/applicant/applicant-transfer/view")}
                                className="bg-amber-500"
                            >
                                View Applicant Transfer
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ApplicantTransferForm />
                </CardContent>
            </Card>
        </PageWrapper>
    );
}
