import PageWrapper from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import ChangePasswordForm from "@/features/auth/change-password-form";

export default function ChangePassword() {
  const navigate = useNavigate();
  return (
    <PageWrapper>
      <Card>
        <CardHeader>
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <CardHeader>
              <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <Button
                onClick={() => navigate("/")}
                className="bg-amber-500"
              >
                Back
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
        <ChangePasswordForm />
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
