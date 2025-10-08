"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
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
import { updateDepartmentApi } from "@/services/DepartmentService";
import { getFacultiesApi } from "@/services/FacultyService";
import { useQuery } from "@tanstack/react-query";
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

const formSchema = z.object({
  faculty_id: z
  .number({ invalid_type_error: "Faculty is required" })
  .min(1, "Faculty is required"),
  name: z.string().min(2, "Department name is too short").max(50, "Department name is too long")
    .refine((value) => !/<\/?[^>]+(>|$)/.test(value), {
      message: "Invalid characters or HTML tags are not allowed",
    }),
  abbreviation: z.string().min(2, "Abbreviation is too short").max(50, "Abbreviation is too long")
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

export default function DepartmentEditForm() {
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
      faculty_id: 0,
      name: "",
      abbreviation: "",
      remarks: "",
    },
  });

  const { data: faculties, isLoading: facultiesLoading } = useQuery({
    queryKey: ["faculties"],
    queryFn: getFacultiesApi,
  });

  useEffect(() => {
    form.reset(initialData);
    setLoading(false);
  }, [id, initialData, form, toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const success = await updateDepartmentApi(
        id || "",
        values.faculty_id,
        values.name,
        values.abbreviation,
        values.remarks || ""
      );
      if (success) {
        toast({
          title: "Success!",
          description: `${values.name} department updated successfully`,
        });
        navigate("/faculty/department/view");
      } else {
        throw new Error("Failed to update department");
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
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="faculty_id"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Faculty</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between text-left font-light"
                    >
                      {field.value
                        ? faculties?.find(
                          (item: { id: number }) => Number(item.id) === field.value
                        )?.name || "Select a faculty"
                        : facultiesLoading
                          ? "Loading faculties..."
                          : "Select a faculty"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search faculties..." />
                      <CommandList>
                        <CommandEmpty>No faculties found.</CommandEmpty>
                        <CommandGroup>
                          {faculties?.map((faculty: { id: number; name: string }) => (
                            <CommandItem
                              key={faculty.id}
                              onSelect={() => field.onChange(Number(faculty.id))}
                            >
                              {faculty.name}
                              {field.value === Number(faculty.id) && (
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
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department Name</FormLabel>
                <FormControl>
                  <Input placeholder="department name" {...field} />
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
                  <Input placeholder="abbreviation" {...field} />
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
            onClick={() => navigate("/faculty/department/view")}
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
