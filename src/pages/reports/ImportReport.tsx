import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import PageWrapper from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImportReport from "@/features/reports/import-report";

export default function InportReport() {
    const navigate = useNavigate();
    return (
        <PageWrapper>
            <Card>
                <CardHeader>
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <CardHeader>
                                <CardTitle>Upload Report To Merge</CardTitle>
                            </CardHeader>
                            <Button
                                onClick={() => navigate("/reports/view-report-table")}
                                className="bg-amber-500"
                            >
                                View Exported Report
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ImportReport />
                </CardContent>
            </Card>
        </PageWrapper>
    );
}