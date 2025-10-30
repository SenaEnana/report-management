
import PageWrapper from "@/components/layout/PageWrapper"
import { Card } from "@/components/ui/card";
import BranchHistory from "@/features/reports/branch-pos/branch-history";

export default function BranchHistoryPage() {
    return (<>
    <PageWrapper>
        <Card className="p-3">
            <BranchHistory />
            <div className="mb-8">
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 m-2">
            </div>
          </div>
        </div>

      </Card>
    </PageWrapper>
    </>)
};
