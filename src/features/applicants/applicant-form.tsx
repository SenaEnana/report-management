"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
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
import { createApplicantApi } from "@/services/ApplicantsService";
import { getCampusCurriculumApi } from "@/services/CampusCurriculumService";
import { getGenderApi } from "@/services/GenderService";
import { Checkbox } from "@/components/ui/checkbox";
import DropdownField from "@/components/common/form/DropdownField";

const formSchema = z.object({
  first_name: z.string().min(2, "First name must be at least two characters").max(50, "First name is too long")
    .refine((value) => !/<\/?[^>]+(>|$)/.test(value), {
      message: "Invalid characters or HTML tags are not allowed",
    }),
  middle_name: z.string().min(2, "Middle name must be at least two characters").max(50, "Middle name is too long")
    .refine((value) => !/<\/?[^>]+(>|$)/.test(value), {
      message: "Invalid characters or HTML tags are not allowed",
    }),
  last_name: z.string().min(2, "Middle name must be at least two characters").max(50, "Last name is too long")
    .refine((value) => !/<\/?[^>]+(>|$)/.test(value), {
      message: "Invalid characters or HTML tags are not allowed",
    }),
  gender_id: z
    .number({ invalid_type_error: "Gender is required" })
    .min(1, "Gender is required"),
  phone_number: z.string().regex(
    /^\+[1-9]\d{1,14}$/,
    "Phone number must be in E.164 format (e.g., +1234567890)"
  )
    .refine((value) => !/<\/?[^>]+(>|$)/.test(value), {
      message: "Invalid characters or HTML tags are not allowed",
    }),
  birth_date: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
      "Birth date must be in YYYY-MM-DDTHH:MM format"
    ),
  campus_curriculum_id: z
    .number({ invalid_type_error: "Gender is required" })
    .min(1, "Campus Curriculum is required"),
  is_transferred: z.boolean(),
  remarks: z.string()
    .optional()
    .or(z.literal(""))
    .refine((value) => !/<\/?[^>]+(>|$)/.test(value || ""), {
      message: "Invalid characters or HTML tags are not allowed",
    }),
});

export default function ApplicantForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: campusCurriculums } =
    useQuery({
      queryKey: ["campusCurriculums"],
      queryFn: getCampusCurriculumApi,
    });

  const { data: genders } =
    useQuery({
      queryKey: ["genders"],
      queryFn: getGenderApi,
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      middle_name: "",
      last_name: "",
      gender_id: 0,
      phone_number: "",
      birth_date: "",
      campus_curriculum_id: 0,
      is_transferred: true,
      remarks: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Form Submitted:', values);
    setIsSubmitting(true);
    const formattedDate = values.birth_date.slice(0, 16);

    try {
      const success = await createApplicantApi(
        values.first_name,
        values.middle_name,
        values.last_name,
        Number(values.gender_id),
        values.phone_number,
        formattedDate,
        Number(values.campus_curriculum_id),
        values.is_transferred,
        values.remarks || ""
      );

      console.log('API Response:', success);

      if (success) {
        toast({
          title: "Success!",
          description: `${values.first_name} applicant created successfully`,
        });
        form.reset();
      } else {
        throw new Error("Failed to create applicant");
      }
    } catch (error: any) {
      console.error("API Error:", error.response?.data || error.message);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create applicant. Please try again.",
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
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="middle_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Middle Name</FormLabel>
                <FormControl>
                  <Input placeholder="Middle Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Last Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DropdownField
            name="gender_id"
            label="Gender"
            control={form.control}
            options={
              genders?.map((gender: any) => ({
                id: Number(gender.id),
                name: gender.name,
              })) || []
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel>Birth Date</FormLabel>
            <FormField
              control={form.control}
              name="birth_date"
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
        </div>
        <div className="grid grid-cols-2 gap-4">
          <DropdownField
            name="campus_curriculum_id"
            label="Campus Curriculum"
            control={form.control}
            options={
              campusCurriculums?.map((campusCurriculum: any) => ({
                id: Number(campusCurriculum.id),
                name: campusCurriculum.name,
              })) || []
            }
          />
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
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="is_transferred"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-1">
                <FormControl>
                  <Checkbox
                    // checked={field.value}
                    // onCheckedChange={field.onChange}
                    checked={!!field.value} // Ensure it's boolean
                    onCheckedChange={(value) => field.onChange(Boolean(value))}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Is the applicant transferred</FormLabel>
                  <FormDescription>
                    You can uncheck if the applicant is not transferred
                  </FormDescription>
                </div>
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
////filter state management should be applied to all of the tables in the application, now it is only for the batch year table