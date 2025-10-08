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
import { useState } from "react";
import { changePasswordApi } from "@/services/AuthService";

const formSchema = z.object({
  current_password: z.string().min(8, "Password must be at least 8 characters and non empty")
    .refine((value) => !/<\/?[^>]+(>|$)/.test(value), {
      message: "Invalid characters or HTML tags are not allowed",
    }),
  password: z.string().min(8, "Password must be at least 8 characters and non empty")
    .refine((value) => !/<\/?[^>]+(>|$)/.test(value), {
      message: "Invalid characters or HTML tags are not allowed",
    }),
  confirm_password: z.string().min(8, "Password must be at least 8 characters and non empty")
    .refine((value) => !/<\/?[^>]+(>|$)/.test(value), {
      message: "Invalid characters or HTML tags are not allowed",
    }),
});

export default function ChangePasswordForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      current_password: "",
      password: "",
      confirm_password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const success = await changePasswordApi(
        values.current_password,
        values.password,
        values.confirm_password,
      );
      if (success) {
        toast({
          title: "Success!",
          description: `password changed successfully`,
        });
        form.reset();
      } else {
        throw new Error("Failed to change password");
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="current_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input placeholder="current password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input placeholder="new password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input placeholder="confirm password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
