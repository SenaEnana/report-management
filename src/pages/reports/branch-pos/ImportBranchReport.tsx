import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import PageWrapper from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImportForm from "@/features/reports/branch-pos/import-form";

export default function ImportBranchReport() {
    const navigate = useNavigate();
    return (
        <PageWrapper>
            <Card>
                <CardHeader>
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <CardHeader>
                                <CardTitle>Upload Branch Report To Merge</CardTitle>
                            </CardHeader>
                            <Button
                                onClick={() => navigate("/reports/branch-pos/view")}
                                className="bg-amber-500"
                            >
                                View Exported Report
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ImportForm/>
                </CardContent>
            </Card>
        </PageWrapper>
    );
}