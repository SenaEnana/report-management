import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import PageWrapper from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ApplicantForm from "@/features/applicants/applicant-form";

export default function Page() {
  const navigate = useNavigate();
  return (
    <PageWrapper>
      <Card>
        <CardHeader>
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <CardHeader>
                <CardTitle>Create New Applicant</CardTitle>
              </CardHeader>
              <Button
                onClick={() => navigate("/applicant/view")}
                className="bg-amber-500"
              >
                View Applicant
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ApplicantForm />
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
