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
import { uploadReportApi } from "@/services/ReportService";

const formSchema = z.object({
  file: z
    .any()
    .refine((file) => file instanceof File || file === undefined, {
      message: "Invalid file type",
    })
    .optional(),
});

export default function ImportReport() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: undefined,
    },
  });

    async function onSubmit(values: z.infer<typeof formSchema>) {
  console.log("Form Submitted:", values);
  setIsSubmitting(true);

  try {
    const success = await uploadReportApi(values.file);

    if (success) {
      toast({
        title: "Success!",
        description: "Report processed successfully",
      });
      form.reset();
    }
  } catch (error: any) {
    console.error("API Error:", error.message);
    toast({
      title: "Error",
      description: error.message,
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
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Excel File</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={(e) => field.onChange(e.target.files?.[0])}
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
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
