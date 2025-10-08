"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createDepartmentApi } from "@/services/DepartmentService";
import { getFacultiesApi } from "@/services/FacultyService";
import DropdownField from "@/components/common/form/DropdownField";

const formSchema = z.object({
  faculty_id: z
    .number({ invalid_type_error: "Faculty is required" })
    .min(1, "Faculty is required"),
  name: z.string().min(2, "Department name is required").max(50, "Department name is too long")
    .refine((value) => !/<\/?[^>]+(>|$)/.test(value), {
      message: "Invalid characters or HTML tags are not allowed",
    }),
  abbreviation: z.string().min(2, "Abbreviation must be at least 2 characters").max(50, "Abbreviation is too long")
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

export default function DepartmentForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: faculties, isLoading: facultiesLoading } = useQuery({
    queryKey: ["faculties"],
    queryFn: getFacultiesApi,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      faculty_id: 0,
      name: "",
      abbreviation: "",
      remarks: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const success = await createDepartmentApi(
        values.faculty_id,
        values.name,
        values.abbreviation,
        values.remarks || ""
      );
      if (success) {
        toast({
          title: "Success!",
          description: `${values.name} department created successfully`,
        });
        form.reset();
      } else {
        throw new Error("Failed to create department");
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <DropdownField
            name="faculty_id"
            label="Faculty"
            control={form.control}
            options={
              faculties?.map((faculty: any) => ({
                id: Number(faculty.id),
                name: faculty.name,
              })) || []
            }
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department Name</FormLabel>
                <FormControl>
                  <Input placeholder="Department name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="abbreviation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Abbreviation</FormLabel>
                <FormControl>
                  <Input placeholder="Abbreviation" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="remarks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Remarks</FormLabel>
                <FormControl>
                  <Input placeholder="Remarks" {...field} />
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
            disabled={isSubmitting || facultiesLoading}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
