import PageWrapper from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MerchantEditForm from "@/features/merchant/merchant-edit-form";

export default function EditMerchant() {
  return (
    <PageWrapper>
      <Card>
        <CardHeader>
          <CardTitle>Update Merchant</CardTitle>
        </CardHeader>
        <CardContent>
          <MerchantEditForm />
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
