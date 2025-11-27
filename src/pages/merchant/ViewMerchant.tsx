import PageWrapper from "@/components/layout/PageWrapper"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import MerchantTable from "@/features/merchant/merchant-table"

export default function ViewMerchant() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("userData") || "{}");

  return (
    <PageWrapper>
      <Card className="p-3">
      <div className="mb-8">
      <div className="flex items-center justify-between">
            <CardHeader>
              <CardTitle>Merchant List</CardTitle>
              <p className="text-muted-foreground">
                This is the list of all merchants or terminalts.
              </p>
            </CardHeader>
            <div className="flex items-center gap-4 m-2">
            {currentUser.role === "admin" && (
              <Button className="bg-amber-500 "
                onClick={() => navigate("/merchant/create")}>
                <Plus className="mr-2 h-4 w-4" /> Create New Merchant
              </Button>
              )}
            </div>
          </div>
        </div>
        <MerchantTable />
      </Card>
    </PageWrapper>
  )
}
