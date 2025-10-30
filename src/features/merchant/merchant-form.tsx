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
import { createMerchantApi } from "@/services/MerchantService";

const formSchema = z.object({
  terminal_code: z.string().min(8, "Terminal code must be at least two characters").max(50, "Terminal code is too long")
    .refine((value) => !/<\/?[^>]+(>|$)/.test(value), {
      message: "Invalid characters or HTML tags are not allowed",
    }),
  merchant_name: z.string().min(2, "Merchant name must be at least two characters").max(50, "Middle name is too long")
    .refine((value) => !/<\/?[^>]+(>|$)/.test(value), {
      message: "Invalid characters or HTML tags are not allowed",
    }),
  branch_id: z.number().min(1, "Branch ID must be non empty").max(7, "Branch ID must be less than or equal to 7"),
});

export default function MerchantForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      terminal_code: "",
      merchant_name: "",
      branch_id: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Form Submitted:', values);
    setIsSubmitting(true);

    try {
      const success = await createMerchantApi(
        values.terminal_code,
        values.merchant_name,
        Number(values.branch_id),
      );

      console.log('API Response:', success);

      if (success) {
        toast({
          title: "Success!",
          description: `${values.merchant_name} Merchant created successfully`,
        });
        form.reset();
      } else {
        throw new Error("Failed to create merchant");
      }
    } catch (error: any) {
      console.error("API Error:", error.response?.data || error.message);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create merchant. Please try again.",
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
            name="terminal_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Terminal Code</FormLabel>
                <FormControl>
                  <Input placeholder="Terminal code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="merchant_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Merchant Name</FormLabel>
                <FormControl>
                  <Input placeholder="Merchant Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="branch_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch ID</FormLabel>
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
