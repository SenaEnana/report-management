"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
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
import { useQuery } from "@tanstack/react-query";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import {
    Command,
    CommandInput,
    CommandList,
    CommandGroup,
    CommandItem,
    CommandEmpty,
} from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { getApplicantApi } from "@/services/ApplicantsService";
import { updateApplicantTransferApi } from "@/services/ApplicantTransferService";
import { getYearApi } from "@/services/YearService";
import { getSemesterApi } from "@/services/SemesterService";
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

export default function ApplicantTransferEditForm() {
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
            applicant_id: 0,
            transferd_from: "",
            transferd_date: "",
            year_id: 0,
            semester_id: 0,
            transfer_reason: "",
            remarks: "",
        },
    });

    const { data: applicants, isLoading: applicantsLoading } = useQuery({
        queryKey: ["applicants"],
        queryFn: getApplicantApi,
    });
    const { data: years, isLoading: yearsLoading } = useQuery({
        queryKey: ["years"],
        queryFn: getYearApi,
    });
    const { data: semesters, isLoading: semestersLoading } = useQuery({
        queryKey: ["semesters"],
        queryFn: getSemesterApi,
    });

    const renderDropdown = (field: any, data: any[] = [], loading: boolean, label: string) => (
        <FormItem>
            <FormLabel>{label}</FormLabel>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between text-left font-light"
                    >
                        {field.value
                            ? data?.find((item) => String(item.id) === field.value.toString())
                                ?.name || ""
                            : loading
                                ? `Loading ${label.toLowerCase()}...`
                                : `Select a ${label.toLowerCase()}`}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
                        <CommandList>
                            <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
                            <CommandGroup>
                                {data?.map((item) => (
                                    <CommandItem
                                        key={item.id}
                                        onSelect={() => field.onChange(Number(item.id))}
                                    >
                                        {item.name}
                                        {field.value === item.id && (
                                            <Check className="ml-auto h-4 w-4 opacity-100" />
                                        )}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <FormMessage />
        </FormItem>
    );

    useEffect(() => {
        form.reset(initialData);
        setLoading(false);
    }, [id, initialData, form, toast]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        const formattedDate = values.transferd_date.slice(0, 16);

        try {
            const success = await updateApplicantTransferApi(
                id || "",
                values.applicant_id,
                values.transferd_from,
                formattedDate,
                values.year_id,
                values.semester_id,
                values.transfer_reason,
                values.remarks || ""
            );
            if (success) {
                toast({
                    title: "Success!",
                    description: `${values.applicant_id} applicant transfer updated successfully`,
                });
                navigate("/applicant/applicant-transfer/view");
            } else {
                throw new Error("Failed to update applicant transfer");
            }
        } catch (error: any) {
            const errorMessage =
                error.message || "Failed to update applicant transfer. Please try again.";
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
                    <Controller
                        name="applicant_id"
                        control={form.control}
                        render={({ field }) =>
                            renderDropdown(field, applicants, applicantsLoading, "Semester")
                        }
                    />
                    <FormField
                        control={form.control}
                        name="transferd_from"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Transferred From</FormLabel>
                                <FormControl>
                                    <Input placeholder="location where transferred from" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormItem>
                        <FormLabel>Transfer Date</FormLabel>
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
                    <Controller
                        name="year_id"
                        control={form.control}
                        render={({ field }) =>
                            renderDropdown(field, years, yearsLoading, "Year")
                        }
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Controller
                        name="semester_id"
                        control={form.control}
                        render={({ field }) =>
                            renderDropdown(field, semesters, semestersLoading, "Semester")
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
                        onClick={() => navigate("/applicant/applicant-transfer/view")}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="bg-amber-500"
                        disabled={isSubmitting || applicantsLoading}
                    >
                        {isSubmitting ? "Updating..." : "Update"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
