import PageWrapper from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import ApplicantGetTrash from "@/features/applicants/applicant-get-trash";

export default function GetTrashApplicant() {
    const navigate = useNavigate();
    return (
        <PageWrapper>
            <Card>
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <CardHeader>
                            <CardTitle>Trashed Resources</CardTitle>
                        </CardHeader>
                        <Button onClick={() => navigate("/applicant/view")} className="bg-amber-500 m-2">Back</Button>
                    </div>
                </div>
                <ApplicantGetTrash />
            </Card>
        </PageWrapper>
    );
}
