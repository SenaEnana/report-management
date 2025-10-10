import PageWrapper from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Custom404() {
    const navigate = useNavigate();
    return (
        <PageWrapper>
            <div className="flex items-center justify-center min-h-screen p-5">
                <div className="p-10 rounded-none text-center">
                    <h1 className="text-9xl font-extrabold text-red-700">404</h1>
                    <p className="text-2xl mt-4 text-red-700">Oops! Page not found.</p>
                    <p className="mt-4 text-gray-700">We can't seem to find the page you're looking for.</p>
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
