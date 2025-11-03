import PageWrapper from "@/components/layout/PageWrapper"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import DistrictTable from "@/features/district/district-table";

export default function ViewDistrict() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <Card className="p-3">
      <div className="mb-8">
      <div className="flex items-center justify-between">
            <CardHeader>
              <CardTitle>District List</CardTitle>
              <p className="text-muted-foreground">
                This is the list of all districts or terminalts.
              </p>
            </CardHeader>
            <div className="flex items-center gap-4 m-2">
              <Button className="bg-amber-500 "
                onClick={() => navigate("/district/create")}>
                <Plus className="mr-2 h-4 w-4" /> Create New District
              </Button>
            </div>
          </div>
        </div>
        <DistrictTable />
      </Card>
    </PageWrapper>
  )
}
