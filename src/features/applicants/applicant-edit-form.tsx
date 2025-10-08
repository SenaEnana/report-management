"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
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
import { getCampusCurriculumApi } from "@/services/CampusCurriculumService";
import { getGenderApi } from "@/services/GenderService";
import { Checkbox } from "@/components/ui/checkbox";
import { updateApplicantApi } from "@/services/ApplicantsService";

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
  .number({ invalid_type_error: "Campus curriculum is required" })
  .min(1, "Campus curriculum is required"),
  is_transferred: z.boolean(),
  remarks: z.string()
    .optional()
    .or(z.literal(""))
    .refine((value) => !/<\/?[^>]+(>|$)/.test(value || ""), {
      message: "Invalid characters or HTML tags are not allowed",
    }),
});

export default function ApplicantEditForm() {
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

  const { data: campusCurriculums, isLoading: campusCurriculumsLoading } = useQuery({
    queryKey: ["campusCurriculums"],
    queryFn: getCampusCurriculumApi,
  });

  const { data: genders, isLoading: gendersLoading } = useQuery({
    queryKey: ["genders"],
    queryFn: getGenderApi,
  });

  const renderDropdown = (field: any, data: any[], loading: boolean, label: string) => (
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
    const formattedDate = values.birth_date.slice(0, 16);

    try {
      const success = await updateApplicantApi(
        id || "",
        values.first_name,
        values.middle_name,
        values.last_name,
        values.gender_id,
        values.phone_number,
        formattedDate,
        values.campus_curriculum_id,
        values.is_transferred,
        values.remarks || ""
      );
      if (success) {
        toast({
          title: "Success!",
          description: `${values.first_name} applicant updated successfully`,
        });
        navigate("/applicant/view"); 
      } else {
        throw new Error("Failed to update applicant");
      }
    } catch (error: any) {
      const errorMessage =
        error.message || "Failed to update applicant. Please try again.";
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

          <Controller
            name="gender_id"
            control={form.control}
            render={({ field }) =>
              renderDropdown(field, genders, gendersLoading, "Gender")
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
          <Controller
            name="campus_curriculum_id"
            control={form.control}
            render={({ field }) =>
              renderDropdown(field, campusCurriculums, campusCurriculumsLoading, "Campus Curriculum")
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
                    checked={field.value}
                    onCheckedChange={field.onChange}
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
            onClick={() => navigate("/applicant/view")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-amber-500"
            disabled={isSubmitting || campusCurriculumsLoading || gendersLoading}
          >
            {isSubmitting ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
