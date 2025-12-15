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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { uploadBranchReportApi, updateExchangeRateApi } from "@/services/ReportService";

const formSchema = z.object({
  file: z.any().refine((file) => file instanceof File || file === undefined, {
    message: "Invalid file type",
  }),
  transaction_date: z.string().min(2, "Transaction date field must be filled")
    .refine((value) => !/<\/?[^>]+(>|$)/.test(value), {
      message: "Invalid characters or HTML tags are not allowed",
    }),
});

const rateSchema = z.object({
  CUP: z.coerce.number(),
  MC: z.coerce.number(),
  VC: z.coerce.number(),
  date: z.string().min(2, "Date field must be filled")
    .refine((value) => !/<\/?[^>]+(>|$)/.test(value), {
      message: "Invalid characters or HTML tags are not allowed",
    }),
});

export default function ImportForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: undefined,
      transaction_date: ""
    },
  });

  const rateForm = useForm<z.infer<typeof rateSchema>>({
    resolver: zodResolver(rateSchema),
    defaultValues: { CUP: 0, MC: 0, VC: 0 },
  });

  async function onSubmitRate(values: z.infer<typeof rateSchema>) {
    try {
      const success = await updateExchangeRateApi(values.CUP, values.MC, values.VC, values.date);
      if (success) {
        toast({
          title: "Exchange Rate Saved!",
          description: "You can now upload a report.",
        });
      } else {
        throw new Error("Failed to save exchange rate");
      }
      rateForm.reset();
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const success = await uploadBranchReportApi(values.file, values.transaction_date);
      if (success) {
        toast({ title: "Success!", description: "Report processed successfully" });
        form.reset();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload report",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Exchange Rate Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Exchange Rate</h2>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-500">Submit Exchange Rate</Button>
          </DialogTrigger>
          <DialogContent className="bg-white text-black dark:bg-zinc-900 dark:text-white">
            <DialogHeader>
              <DialogTitle>Submit Exchange Rate</DialogTitle>
              <DialogDescription>
                Enter the exchange rate details below.
              </DialogDescription>
            </DialogHeader>

            <Form {...rateForm}>
              <form onSubmit={rateForm.handleSubmit(onSubmitRate)} className="space-y-4">
                <FormField
                  control={rateForm.control}
                  name="CUP"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>China Union Pay Rate</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={rateForm.control}
                  name="MC"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Master Card Rate</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={rateForm.control}
                  name="VC"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visa Card Rate</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                  <FormField
                  control={rateForm.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> 

                <Button type="submit" className="bg-amber-600 w-full">
                  Save
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Upload Form */}
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
                      // 👇 removed disabled={!isRateSubmitted}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
                <FormField
                  control={form.control}
                  name="transaction_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
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
              disabled={isSubmitting} // 👇 removed !isRateSubmitted check
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
