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
import { createBranchAPI } from "@/services/BranchService";

const formSchema = z.object({
branch_name: z.string().min(2, "Branch name must be at least two characters").max(50, "Branch name is too long")
    .refine((value) => !/<\/?[^>]+(>|$)/.test(value), {
      message: "Invalid characters or HTML tags are not allowed",
    }),
  district_id: z.number().min(1, "District ID must be non empty").max(7, "District ID must be less than or equal to 7"),
});

export default function BranchForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      branch_name: "",
      district_id: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Form Submitted:', values);
    setIsSubmitting(true);

    try {
      const success = await createBranchAPI(
        values.branch_name,
        Number(values.district_id),
      );

      console.log('API Response:', success);

      if (success) {
        toast({
          title: "Success!",
          description: `${values.branch_name} Branch created successfully`,
        });
        form.reset();
      } else {
        throw new Error("Failed to create branch");
      }
    } catch (error: any) {
      console.error("API Error:", error.response?.data || error.message);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create branch. Please try again.",
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
            name="branch_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch Name</FormLabel>
                <FormControl>
                  <Input placeholder="Branch Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="district_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>District ID</FormLabel>
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
