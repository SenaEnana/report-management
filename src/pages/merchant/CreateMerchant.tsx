import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import PageWrapper from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MerchantForm from "@/features/merchant/merchant-form";

export default function CreateMerchant() {
  const navigate = useNavigate();
  return (
    <PageWrapper>
      <Card>
        <CardHeader>
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <CardHeader>
                <CardTitle>Create New Merchant</CardTitle>
              </CardHeader>
              <Button
                onClick={() => navigate("/merchant/view")}
                className="bg-amber-500"
              >
                View Merchant
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <MerchantForm />
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
