import PageWrapper from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function PageForbidden() {
    const navigate = useNavigate();
    return (
        <PageWrapper>
            <div className="flex items-center justify-center min-h-screen p-5">
            <div className="p-10 rounded-none text-center">
                    <h1 className="text-6xl font-extrabold text-red-700">403 - Page Forbidden</h1>
                    <p className="text-2xl mt-4 text-red-700">Oops! You do not have access to this page.</p>
                    <div className="mt-6">
                        <Button
                            size="lg"
                            className="bg-amber-500"
                            onClick={() => {
                                navigate('/');
                            }}
                        >
                            Go to Homepage
                        </Button>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}
