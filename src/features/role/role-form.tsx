"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { createRoleApi } from "@/services/RoleService"

const formSchema = z.object({
    name: z.string().min(2, "Name is too short").max(255, "Name is too long")
        .refine((value) => !/<\/?[^>]+(>|$)/.test(value), {
            message: "Invalid characters or HTML tags are not allowed",
        }),
    guard_name: z.string().min(2, "Guard Name is too short").max(255, "Guard Name is too long")
        .refine((value) => !/<\/?[^>]+(>|$)/.test(value), {
            message: "Invalid characters or HTML tags are not allowed",
        }),
})

export default function RoleForm() {
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            guard_name: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        try {
            const success = await createRoleApi(values.name, values.guard_name)
            if (success) {
                toast({
                    title: "Success!",
                    description: `${values.name} role created successfully`,
                })
                form.reset()
            } else {
                throw new Error("Failed to create role")
            }
        } catch (error: any) {
            const errorMessage =
                error.message || "Failed to create faculty. Please try again.";
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role Name</FormLabel>
                            <FormControl>
                                <Input placeholder="role name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="guard_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Guard Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Guard Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => form.reset()} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button type="submit" className="bg-amber-500" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

