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
import { updateRoleApi } from "@/services/RoleService";

const formSchema = z.object({
    name: z.string().min(2, "Name is too short").max(255, "Name is too long")
        .refine((value) => !/<\/?[^>]+(>|$)/.test(value), {
            message: "Invalid characters or HTML tags are not allowed",
        }),
    guard_name: z.string().min(2, "Guard Name is too short").max(255, "Guard Name is too long")
        .refine((value) => !/<\/?[^>]+(>|$)/.test(value), {
            message: "Invalid characters or HTML tags are not allowed",
        }),
})

export default function RoleEditForm() {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();

    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    const initialData = location.state || {};

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            guard_name: "",
        },
    });

    useEffect(() => {
        form.reset(initialData);
        setLoading(false);
    }, [id, initialData, form, toast]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            const success = await updateRoleApi(
                id || "",
                values.name,
                values.guard_name
            );
            if (success) {
                toast({
                    title: "Success!",
                    description: `${values.name} role updated successfully`,
                });
                navigate("/user/role/view");
            } else {
                throw new Error("Failed to update role");
            }
        } catch (error: any) {
            const errorMessage =
                error.message || "Failed to create faculty. Please try again.";
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
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="guard_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Guard Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/user/role/view")}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="bg-amber-500"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Updating..." : "Update"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
