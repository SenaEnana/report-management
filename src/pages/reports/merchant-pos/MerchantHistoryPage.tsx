
import PageWrapper from "@/components/layout/PageWrapper"
import { Card } from "@/components/ui/card";
import MerchantHistory from '@/features/reports/merchant-pos/merchant-history';

export default function MerchantHistoryPage() {
    return (<>
    <PageWrapper>
        <Card className="p-3">
            <MerchantHistory />
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
