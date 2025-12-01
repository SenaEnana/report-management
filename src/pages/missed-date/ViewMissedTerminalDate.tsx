import PageWrapper from "@/components/layout/PageWrapper"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import MissedTerminalDate from "@/features/missed-date/missed-terminal-date";

export default function ViewMissedTerminalDate() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <Card className="p-3">
      <div className="mb-8">
      <div className="flex items-center justify-between">
            <CardHeader>
              <CardTitle>Missed Terminal Report Date List</CardTitle>
              <p className="text-muted-foreground">
                This is the list of all missed transaction or report date.
              </p>
            </CardHeader>
            <div className="flex items-center gap-4 m-2">
              <Button className="bg-amber-500 "
                onClick={() => navigate("/reports/merchant-pos/import-report")}>
                <Plus className="mr-2 h-4 w-4" /> Upload Missed Report
              </Button>
            </div>
          </div>
        </div>
        <MissedTerminalDate />
      </Card>
    </PageWrapper>
  )
}
