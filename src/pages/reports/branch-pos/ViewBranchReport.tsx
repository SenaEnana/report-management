import PageWrapper from "@/components/layout/PageWrapper"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { Download } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import ReportTable from "@/features/reports/branch-pos/report-table"

export default function ViewBranchReport() {
  const navigate = useNavigate();
  const [branchReportUrl, setBranchReportUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = localStorage.getItem("lastBranchReportUrl");
    if (url) setBranchReportUrl(url);
  }, []);

const handleDownloadBranchReport = () => {
  const url = localStorage.getItem("lastBranchReportUrl");

  if (!url) {
    alert("No report available to download. Upload first!");
    return;
  }

  const today = new Date().toISOString().split("T")[0];
  const fileName = `daily_branch_pos_performance_${today}.xlsx`;

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  if (!branchReportUrl) {
    return <p>No report available. Upload one first.</p>;
  }
////////try tmrw
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
                onClick={() => navigate("/reports/branch-pos/import-report")}>
                <Plus className="mr-2 h-4 w-4" /> Upload Report
              </Button>
            <Button className="bg-amber-500 "
            onClick={() => { handleDownloadBranchReport ()
              // const link = document.createElement("a");
              // link.href = branchReportUrl;
              // link.setAttribute("download", "merged_report.xlsx");
              // document.body.appendChild(link);
              // link.click();
              // link.remove();
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