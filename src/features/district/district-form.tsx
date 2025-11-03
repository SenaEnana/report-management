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
import { createDistrictAPI } from "@/services/DistrictService";

const formSchema = z.object({
district_name: z.string().min(2, "District name must be at least two characters").max(50, "District name is too long")
    .refine((value) => !/<\/?[^>]+(>|$)/.test(value), {
      message: "Invalid characters or HTML tags are not allowed",
    }),
});

export default function DistrictForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      district_name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Form Submitted:', values);
    setIsSubmitting(true);

    try {
      const success = await createDistrictAPI(
        values.district_name,
      );

      console.log('API Response:', success);

      if (success) {
        toast({
          title: "Success!",
          description: `${values.district_name} District created successfully`,
        });
        form.reset();
      } else {
        throw new Error("Failed to create district");
      }
    } catch (error: any) {
      console.error("API Error:", error.response?.data || error.message);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create district. Please try again.",
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
            name="district_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>District Name</FormLabel>
                <FormControl>
                  <Input placeholder="District Name" {...field} />
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
