import PageWrapper from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import ApplicantDetailPage from "@/features/applicants/applicant-detail-page";
import { useNavigate } from "react-router-dom";

export default function ApplicantDetail() {
    const navigate = useNavigate();
    return (
        <PageWrapper>
            <Card>
                <div className="flex items-center justify-between">
                    <CardHeader>
                        <CardTitle>Applicant Detail</CardTitle>
                    </CardHeader>
                </div>
                <ApplicantDetailPage />
                <Button
                    onClick={() => navigate("/applicant/view")}
                    className="bg-teal-950 m-2 float-end"
                >
                    Back
                </Button>
            </Card>
        </PageWrapper>
    );
}