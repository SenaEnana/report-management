import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import PageWrapper from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DistrictForm from "@/features/district/district-form";

export default function CreateDistrict() {
  const navigate = useNavigate();
  return (
    <PageWrapper>
      <Card>
        <CardHeader>
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <CardHeader>
                <CardTitle>Create New District</CardTitle>
              </CardHeader>
              <Button
                onClick={() => navigate("/district/view")}
                className="bg-amber-500"
              >
                View District
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DistrictForm />
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
