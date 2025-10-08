import PageWrapper from "@/components/layout/PageWrapper"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import ApplicantTransferTable from "@/features/applicant-transfer/applicant-transfer-table"

export default function ViewApplicantTransfer() {
    const navigate = useNavigate();

    return (
        <PageWrapper>
            <Card className="p-3">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <CardHeader>
                            <CardTitle>Transfer Applicants List</CardTitle>
                            <p className="text-muted-foreground">
                                This is the list of all transfer applicants.
                            </p>
                        </CardHeader>
                        <div className="flex items-center gap-4 m-2">
                            <Button className="bg-amber-500 "
                                onClick={() => navigate("/applicant/applicant-transfer/view/create")}>
                                <Plus className="mr-2 h-4 w-4" /> Create Transfer Applicant
                            </Button>
                        </div>
                    </div>
                </div>
                <ApplicantTransferTable />
            </Card>
        </PageWrapper>
    )
}
