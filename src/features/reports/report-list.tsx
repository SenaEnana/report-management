
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function ReportList() {
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const url = localStorage.getItem("lastReportUrl");
    if (url) setReportUrl(url);
  }, []);

  if (!reportUrl) {
    return <p>No report available. Upload one first.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Your Last Report</h1>
      <div className="flex gap-4">
        <Button
          onClick={() => {
            const link = document.createElement("a");
            link.href = reportUrl;
            link.setAttribute("download", "merged_report.xlsx");
            document.body.appendChild(link);
            link.click();
            link.remove();
          }}
        >
          Download
        </Button>
        <Button onClick={() => navigate("/reports/view-report-table")}>View</Button>
        {/* <Button onClick={() => window.open(reportUrl, "_blank")}>View</Button> */}
      </div>
    </div>
  );
}
