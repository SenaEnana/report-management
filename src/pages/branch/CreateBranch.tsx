import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import PageWrapper from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BranchForm from "@/features/branch/branch-form";

export default function CreateBranch() {
  const navigate = useNavigate();
  return (
    <PageWrapper>
      <Card>
        <CardHeader>
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <CardHeader>
                <CardTitle>Create New Branch</CardTitle>
              </CardHeader>
              <Button
                onClick={() => navigate("/branch/view")}
                className="bg-amber-500"
              >
                View Branch
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <BranchForm />
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
