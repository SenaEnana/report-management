import PageWrapper from "@/components/layout/PageWrapper"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { Download } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import ReportTable from "@/features/reports/merchant-pos/report-table"

export default function ViewMerchantReport() {
  const navigate = useNavigate();
  const [reportUrl, setReportUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = localStorage.getItem("lastReportUrl");
    if (url) setReportUrl(url);
  }, []);

  if (!reportUrl) {
    return <p>No report available. Upload one first.</p>;
  }

  return (
    <PageWrapper>
      <Card className="p-3">
      <div className="mb-8">
      <div className="flex items-center justify-between">
            <CardHeader>
              <CardTitle>Reports Table</CardTitle>
              <p className="text-muted-foreground">
                Report Detail Table.
              </p>
            </CardHeader>
            <div className="flex items-center gap-4 m-2">
              <Button className="bg-amber-500 "
                onClick={() => navigate("/reports/merchant-pos/import-report")}>
                <Plus className="mr-2 h-4 w-4" /> Upload Report
              </Button>
            <Button className="bg-amber-500 "
            onClick={() => {
              const link = document.createElement("a");
              link.href = reportUrl;
              link.setAttribute("download", "merged_report.xlsx");
              document.body.appendChild(link);
              link.click();
              link.remove();
            }}
          >
            <Download className="mr-2 h-4 w-4" /> Download
          </Button>
            </div>
          </div>
        </div>
        <ReportTable />
      </Card>
    </PageWrapper>
  )
}