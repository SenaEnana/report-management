import PageWrapper from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DistrictEditForm from "@/features/district/district-edit-form";

export default function EditDistrict() {
  return (
    <PageWrapper>
      <Card>
        <CardHeader>
          <CardTitle>Update District</CardTitle>
        </CardHeader>
        <CardContent>
          <DistrictEditForm />
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
