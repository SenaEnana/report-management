"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { updateDistrictApi } from "@/services/DistrictService";

const formSchema = z.object({
district_name: z.string().min(2, "District name must be at least two characters").max(50, "District name is too long")
    .refine((value) => !/<\/?[^>]+(>|$)/.test(value), {
      message: "Invalid characters or HTML tags are not allowed",
    }),
});

export default function DistrictEditForm() {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    const initialData = location.state || {};
    const form = useForm({
        resolver: zodResolver(formSchema),
    defaultValues: {
      district_name: "",
        },
    });

    useEffect(() => {
        form.reset(initialData);
        setLoading(false);
    }, [id, initialData, form, toast]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            const success = await updateDistrictApi(
                id || "",
                values.district_name,
            );
            if (success) {
                toast({
                    title: "Success!",
                    description: `${values.district_name} district updated successfully`,
                });
                navigate("/district/view");
            } else {
                throw new Error("Failed to update district");
            }
        } catch (error: any) {
            const errorMessage =
                error.message || "Failed to update district. Please try again.";
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
           <div className="grid grid-cols-2 gap-4">    
            <FormField
                control={form.control}
                name="district_name"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>District Name</FormLabel>
                    <FormControl>
                    <Input placeholder="District Name" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            </div>
                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/district/view")}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="bg-amber-500"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}