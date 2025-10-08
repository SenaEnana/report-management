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
import { createUserApi } from "@/services/UserService"
import { getGenderApi } from "@/services/GenderService"
import { useQuery } from "@tanstack/react-query"
import DropdownField from "@/components/common/form/DropdownField"

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(255, "Name is too long")
        .refine((value) => !/<\/?[^>]+(>|$)/.test(value), {
            message: "Invalid characters or HTML tags are not allowed",
        }),
    email: z.string()
        .min(1, "Email must be non-empty")
        .max(255, "Email is too long")
        .email("Invalid email format")
        .refine((value) => !/<\/?[^>]+(>|$)/.test(value), {
            message: "Invalid characters or HTML tags are not allowed",
        }),
    username: z.string().min(2, "Username must be at least 2 characters").max(255, "Username is too long")
        .refine((value) => !/<\/?[^>]+(>|$)/.test(value), {
            message: "Invalid characters or HTML tags are not allowed",
        }),
    gender_id: z
        .number({ invalid_type_error: "Gender is required" })
        .min(1, "Gender is required"),
    password: z.string().min(8, "Password must be at least 8 characters")
        .refine((value) => !/<\/?[^>]+(>|$)/.test(value), {
            message: "Invalid characters or HTML tags are not allowed",
        }),
    password_confirmation: z.string().min(8, "Password must be at least 8 characters")
        .refine((value) => !/<\/?[^>]+(>|$)/.test(value), {
            message: "Invalid characters or HTML tags are not allowed",
        }),
})

export default function UserForm() {
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            username: "",
            gender_id: 0,
            password: "",
            password_confirmation: "",
        },
    })
    const { data: genders } =
        useQuery({
            queryKey: ["genders"],
            queryFn: getGenderApi,
        });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        try {
            const success = await createUserApi(values.name, values.email, values.username, values.gender_id, values.password, values.password_confirmation)
            if (success) {
                toast({
                    title: "Success!",
                    description: `${values.name} user created successfully`,
                })
                form.reset()
            } else {
                throw new Error("Failed to create user")
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
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>User Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="user@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="username" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <DropdownField
                        name="gender_id"
                        label="Gender"
                        control={form.control}
                        options={
                            genders?.map((gender: any) => ({
                                id: Number(gender.id),
                                name: gender.name,
                            })) || []
                        }
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="password"
                                        type="password"
                                        {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password_confirmation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password Confirmation</FormLabel>
                                <FormControl>
                                    <Input placeholder="confirm password"
                                        type="password"
                                        {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
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

