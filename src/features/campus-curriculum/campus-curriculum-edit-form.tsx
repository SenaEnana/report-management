"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
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
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ChevronsUpDown, Check } from "lucide-react";
import { updateCampusCurriculumApi } from "@/services/CampusCurriculumService";
import { getCampusApi } from "@/services/CampusService";
import { getCurriculumApi } from "@/services/CurriculumService";
import { getAdmissionTypeApi } from "@/services/AdmissionTypeService";
import { getBatchYearApi } from "@/services/BatchYearService";

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
  total_year: z.number().min(1, "Total Year must be non empty"),
  total_semester: z.number().min(1, "Total Semester must be non empty"),
  semester_per_year: z.number().min(1, "Semester per Year must be non empty"),
  remarks: z.string()
    .optional()
    .or(z.literal(""))
    .refine((value) => !/<\/?[^>]+(>|$)/.test(value || ""), {
      message: "Invalid characters or HTML tags are not allowed",
    }),
});

export default function CampusCurriculumEditForm() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const initialData = location.state || {};

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
      total_year: 1,
      total_semester: 1,
      semester_per_year: 1,
      remarks: "",
    },
  });

  useEffect(() => {
    form.reset(initialData);
    setLoading(false);
  }, [id, initialData, form, toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const success = await updateCampusCurriculumApi(
        id || "",
        values.campus_id,
        values.curriculum_id,
        values.admission_type_id,
        values.batch_year_id.toString(),
        values.total_year,
        values.total_semester,
        values.semester_per_year,
        values.remarks || ""
      );
      if (success) {
        toast({
          title: "Success!",
          description: `${values.campus_id} campus-curriculum updated successfully`,
        });
        navigate("/curriculum/campus-curriculum/view");
      } else {
        throw new Error("Failed to update campus-curriculum");
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

  const renderDropdown = (field: any, data: any, loading: boolean, label: string) => (
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
              ? data?.find(
                (item: { id: number }) => String(item.id) === field.value.toString()
              )?.[label === "Batch Year" ? "year" : "name"] || ""
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
                {data?.map((item: { id: number; name?: string; year?: string }) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() => field.onChange(Number(item.id))}
                  >
                    {item[label === "Batch Year" ? "year" : "name"]}
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="campus_id"
            control={form.control}
            render={({ field }) =>
              renderDropdown(field, campuses, campusesLoading, "Campus")
            }
          />

          <Controller
            name="curriculum_id"
            control={form.control}
            render={({ field }) =>
              renderDropdown(field, curriculums, curriculumsLoading, "Curriculum")
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="admission_type_id"
            control={form.control}
            render={({ field }) =>
              renderDropdown(
                field,
                admissionTypes,
                admissionTypesLoading,
                "Admission Type"
              )
            }
          />

          <Controller
            name="batch_year_id"
            control={form.control}
            render={({ field }) =>
              renderDropdown(field, batchYears, batchYearsLoading, "Batch Year")
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
                <FormLabel>Semester per Year</FormLabel>
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
            onClick={() => navigate("/curriculum/campus-curriculum/view")}
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
