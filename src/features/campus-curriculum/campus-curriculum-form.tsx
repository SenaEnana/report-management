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
import { createCampusCurriculumApi } from "@/services/CampusCurriculumService";
import { getCampusApi } from "@/services/CampusService";
import { getCurriculumApi } from "@/services/CurriculumService";
import { getAdmissionTypeApi } from "@/services/AdmissionTypeService";
import { getBatchYearApi } from "@/services/BatchYearService";
import DropdownField from "@/components/common/form/DropdownField";

const formSchema = z.object({
  campus_id: z
    .number({ invalid_type_error: "Campus is required" })
    .min(1, "Campus is required"),
  curriculum_id: z
    .number({ invalid_type_error: "Curriculum is required" })
    .min(1, "Curriculum is required"),
  admission_type_id: z
    .number({ invalid_type_error: "Admission Type is required" })
    .min(1, "Admission Type is required"),
  batch_year_id: z
    .number({ invalid_type_error: "Batch year is required" })
    .min(1, "Batch year is required"),
  total_year: z.number().min(1, "Total Year must be non empty").max(7, "Total Year must be less than or equal to 7"),
  total_semester: z.number().min(1, "Total Semester must be non empty").max(21, "Total Semester must be less than or equal to 21"),
  semester_per_year: z.number().min(1, "Semester per Year must be non empty").max(3, "Semester per Year must be less than or equal to 3"),
  remarks: z.string()
    .optional()
    .or(z.literal(""))
    .refine((value) => !/<\/?[^>]+(>|$)/.test(value || ""), {
      message: "Invalid characters or HTML tags are not allowed",
    }),
});

export default function CampusCurriculumForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: campuses, isLoading: campusesLoading } = useQuery({
    queryKey: ["campuses"],
    queryFn: getCampusApi,
  });

  const { data: curriculums, isLoading: curriculumsLoading } = useQuery({
    queryKey: ["curriculums"],
    queryFn: getCurriculumApi,
  });

  const { data: admissionTypes, isLoading: admissionTypesLoading } = useQuery({
    queryKey: ["admissionTypes"],
    queryFn: getAdmissionTypeApi,
  });

  const { data: batchYears, isLoading: batchYearsLoading } = useQuery({
    queryKey: ["batchYears"],
    queryFn: getBatchYearApi,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      campus_id: 0,
      curriculum_id: 0,
      admission_type_id: 0,
      batch_year_id: 0,
      total_year: 0,
      total_semester: 0,
      semester_per_year: 0,
      remarks: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const success = await createCampusCurriculumApi(
        values.campus_id,
        values.curriculum_id,
        values.admission_type_id,
        values.batch_year_id,
        values.total_year,
        values.total_semester,
        values.semester_per_year,
        values.remarks || ""
      );
      if (success) {
        toast({
          title: "Success!",
          description: `Campus-curriculum created successfully`,
        });
        form.reset();
      } else {
        throw new Error("Failed to create campus-curriculum");
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
            name="campus_id"
            label="Campus"
            control={form.control}
            options={
              campuses?.map((campus: any) => ({
                id: Number(campus.id),
                name: campus.name,
              })) || []
            }
          />
          <DropdownField
            name="curriculum_id"
            label="Curriculum"
            control={form.control}
            options={
              curriculums?.map((curriculum: any) => ({
                id: Number(curriculum.id),
                name: curriculum.name,
              })) || []
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <DropdownField
            name="admission_type_id"
            label="Admission Type"
            control={form.control}
            options={
              admissionTypes?.map((admissionType: any) => ({
                id: Number(admissionType.id),
                name: admissionType.name,
              })) || []
            }
          />
          <DropdownField
            name="batch_year_id"
            label="Batch Year"
            control={form.control}
            options={
              batchYears?.map((batchYear: any) => ({
                id: Number(batchYear.id),
                name: batchYear.year,
              })) || []
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="total_year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Year</FormLabel>
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

          <FormField
            control={form.control}
            name="total_semester"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Semester</FormLabel>
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
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="semester_per_year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Semester Per Year</FormLabel>
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
            disabled={
              isSubmitting ||
              campusesLoading ||
              curriculumsLoading ||
              admissionTypesLoading ||
              batchYearsLoading
            }
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
