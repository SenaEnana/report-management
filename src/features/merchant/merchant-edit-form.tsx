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
import { updateMerchantApi } from "@/services/MerchantService";

const formSchema = z.object({
//   terminal_code: z.string().min(8, "Terminal code must be at least two characters").max(50, "Terminal code is too long")
//     .refine((value) => !/<\/?[^>]+(>|$)/.test(value), {
//       message: "Invalid characters or HTML tags are not allowed",
//     }),
  merchant_name: z.string().min(2, "Merchant name must be at least two characters").max(50, "Middle name is too long")
    .refine((value) => !/<\/?[^>]+(>|$)/.test(value), {
      message: "Invalid characters or HTML tags are not allowed",
    }),
  branch_id: z.number().min(1, "Branch ID must be non empty").max(7, "Branch ID must be less than or equal to 7"),
});

export default function MerchantEditForm() {
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
            merchant_name: "",
            // terminal_code: "",
            branch_id: 0,
        },
    });

    useEffect(() => {
        form.reset(initialData);
        setLoading(false);
    }, [id, initialData, form, toast]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            const success = await updateMerchantApi(
                id || "",
                values.merchant_name,
                // values.terminal_code,
                values.branch_id,
            );
            if (success) {
                toast({
                    title: "Success!",
                    description: `${values.merchant_name} merchant updated successfully`,
                });
                navigate("/merchant/view");
            } else {
                throw new Error("Failed to update merchant");
            }
        } catch (error: any) {
            const errorMessage =
                error.message || "Failed to update merchant. Please try again.";
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
             {/* <FormField
                control={form.control}
                name="terminal_code"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Terminal Code</FormLabel>
                    <FormControl>
                    <Input placeholder="Terminal code" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            /> */}
            <FormField
                control={form.control}
                name="merchant_name"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Merchant Name</FormLabel>
                    <FormControl>
                    <Input placeholder="Merchant Name" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            </div>

            <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="branch_id"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Branch ID</FormLabel>
                    <FormControl>
                    <Input
                        placeholder="0"
                        {...field}
                        value={field.value?.toString()}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                    />
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
                        onClick={() => navigate("/merchant/view")}
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