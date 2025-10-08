import PageWrapper from "@/components/layout/PageWrapper"
import { Button } from "@/components/ui/button"
import ApplicantTable from "@/features/applicants/applicant-table"
import { Plus } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function ViewApplicant() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <Card className="p-3">
      <div className="mb-8">
      <div className="flex items-center justify-between">
            <CardHeader>
              <CardTitle>Applicants List</CardTitle>
              <p className="text-muted-foreground">
                This is the list of all applicants.
              </p>
            </CardHeader>
            <div className="flex items-center gap-4 m-2">
              <Button className="bg-amber-500 "
                onClick={() => navigate("/applicant/view/create")}>
                <Plus className="mr-2 h-4 w-4" /> Create New Applicant
              </Button>
              <Button variant="default" className="bg-[#1e2c51] text-white hover:bg-[#1e2c51]/90"
                onClick={() => navigate("/applicant/applicant-transfer/view/create")}>
                <Plus className="mr-2 h-4 w-4" /> Create New Transfer
              </Button>
            </div>
          </div>
        </div>
        <ApplicantTable />
      </Card>
    </PageWrapper>
  )
}
