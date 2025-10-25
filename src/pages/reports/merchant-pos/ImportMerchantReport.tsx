import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import PageWrapper from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImportForm from "@/features/reports/merchant-pos/import-form";

export default function ImportMerchantReport() {
    const navigate = useNavigate();
    return (
        <PageWrapper>
            <Card>
                <CardHeader>
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <CardHeader>
                                <CardTitle>Upload Merchant Report To Merge</CardTitle>
                            </CardHeader>
                            <Button
                                onClick={() => navigate("/reports/merchant-pos/view")}
                                className="bg-amber-500"
                            >
                                View Exported Report
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ImportForm />
                </CardContent>
            </Card>
        </PageWrapper>
    );
}