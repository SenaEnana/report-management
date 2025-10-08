"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getApplicantApi } from "@/services/ApplicantsService";
import DropdownField from "@/components/common/form/DropdownField";
import { getYearApi } from "@/services/YearService";
import { getSemesterApi } from "@/services/SemesterService";
import { createApplicantTransferApi } from "@/services/ApplicantTransferService";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
    applicant_id: z
        .number({ invalid_type_error: "Applicant is required" })
        .min(1, "Applicant is required"),
    transferd_from: z.string().min(1, "This field is required").max(50, "Too long")
        .refine((value) => !/<\/?[^>]+(>|$)/.test(value), {
            message: "Invalid characters or HTML tags are not allowed",
        }),
    transferd_date: z
        .string()
        .regex(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
            "Birth date must be in YYYY-MM-DDTHH:MM format"
        ),
    year_id: z
        .number({ invalid_type_error: "Year is required" })
        .min(1, "Year is required"),
    semester_id: z
        .number({ invalid_type_error: "Semester is required" })
        .min(1, "Semester is required"),
    transfer_reason: z.string().min(1, "Transferred reason is required").max(200, "Too long")
        .refine((value) => !/<\/?[^>]+(>|$)/.test(value), {
            message: "Invalid characters or HTML tags are not allowed",
        }),
    remarks: z.string()
        .optional()
        .or(z.literal(""))
        .refine((value) => !/<\/?[^>]+(>|$)/.test(value || ""), {
            message: "Invalid characters or HTML tags are not allowed",
        }),
});

export default function ApplicantTransferForm() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: applicants } =
        useQuery({
            queryKey: ["applicants"],
            queryFn: getApplicantApi,
        });

    const { data: years } =
        useQuery({
            queryKey: ["years"],
            queryFn: getYearApi,
        });

    const { data: semesters } =
        useQuery({
            queryKey: ["semesters"],
            queryFn: getSemesterApi,
        });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            applicant_id: 0,
            transferd_from: "",
            transferd_date: "",
            year_id: 0,
            semester_id: 0,
            transfer_reason: "",
            remarks: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log('Form Submitted:', values);
        setIsSubmitting(true);
        const formattedDate = values.transferd_date.slice(0, 16);

        try {
            const success = await createApplicantTransferApi(
                Number(values.applicant_id),
                values.transferd_from,
                formattedDate,
                Number(values.year_id),
                Number(values.semester_id),
                values.transfer_reason,
                values.remarks || ""
            );

            console.log('API Response:', success);

            if (success) {
                toast({
                    title: "Success!",
                    description: `${values.transferd_from} applicant transfer created successfully`,
                });
                form.reset();
            } else {
                throw new Error("Failed to create applicant transfer");
            }
        } catch (error: any) {
            console.error("API Error:", error.response?.data || error.message);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to create applicant transfer. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-2 gap-4">

                    <DropdownField
                        name="applicant_id"
                        label="Applicant"
                        control={form.control}
                        options={
                            applicants?.map((applicant: any) => ({
                                id: Number(applicant.id),
                                name: applicant.name,
                            })) || []
                        }
                    />
                    <FormField
                        control={form.control}
                        name="transferd_from"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Transferred Form</FormLabel>
                                <FormControl>
                                    <Input placeholder="location of transferred from" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormItem>
                        <FormLabel>Transferred Date</FormLabel>
                        <FormField
                            control={form.control}
                            name="transferd_date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="datetime-local"
                                            placeholder="YYYY-MM-DDTHH:MM"
                                            value={field.value || ""}
                                            onChange={(e) => field.onChange(e.target.value)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </FormItem>
                    <DropdownField
                        name="year_id"
                        label="Year"
                        control={form.control}
                        options={
                            years?.map((year: any) => ({
                                id: Number(year.id),
                                name: year.name,
                            })) || []
                        }
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <DropdownField
                        name="semester_id"
                        label="Semester"
                        control={form.control}
                        options={
                            semesters?.map((semester: any) => ({
                                id: Number(semester.id),
                                name: semester.name,
                            })) || []
                        }
                    />
                    <FormField
                        control={form.control}
                        name="transfer_reason"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Transfer Reason</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="transfer reason" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="remarks"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Remark</FormLabel>
                                <FormControl>
                                    <Input placeholder="remark" {...field} />
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
                        onClick={() => form.reset()}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="bg-amber-500"
                        disabled={isSubmitting}
                    // disabled={isSubmitting || !form.formState.isValid} 
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}