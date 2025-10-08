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
import { updateFacultyApi } from "@/services/FacultyService";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least two characters")
    .max(50, "Name must be at most 50 characters")
    .refine((value) => !/<\/?[^>]+(>|$)/.test(value), {
      message: "Invalid characters or HTML tags are not allowed",
    }),
  abbreviation: z.string().min(2, "Abbreviation must be at least two characters")
    .max(5, "Abbreviation must be at most 5 characters")
    .refine((value) => !/<\/?[^>]+(>|$)/.test(value), {
      message: "Invalid characters or HTML tags are not allowed",
    }),
  remarks: z.string()
    .optional()
    .or(z.literal(""))
    .refine((value) => !/<\/?[^>]+(>|$)/.test(value || ""), {
      message: "Invalid characters or HTML tags are not allowed",
    }),
})

export default function FacultyEditForm() {
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
      abbreviation: "",
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
      const success = await updateFacultyApi(
        id || "",
        values.name,
        values.abbreviation,
        values.remarks || ""
      );
      if (success) {
        toast({
          title: "Success!",
          description: `${values.name} faculty updated successfully`,
        });
        navigate("/faculty/view");
      } else {
        throw new Error("Failed to update faculty");
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
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Faculty Name</FormLabel>
                <FormControl>
                  <Input placeholder="faculty name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
            onClick={() => navigate("/faculty/view")}
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
