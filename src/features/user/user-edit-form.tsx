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
import { updateUserApi } from "@/services/UserService";
import { useQuery } from "@tanstack/react-query";
import { getGenderApi } from "@/services/GenderService";
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

export default function UserEditForm() {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    const initialData = location.state || {};
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            username: "",
            gender_id: 0,
            password: "",
            password_confirmation: "",
        },
    });

    const { data: genders, isLoading: gendersLoading } = useQuery({
        queryKey: ["genders"],
        queryFn: getGenderApi,
    });

    useEffect(() => {
        form.reset(initialData);
        setLoading(false);
    }, [id, initialData, form, toast]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            const success = await updateUserApi(
                id || "",
                values.name,
                values.email,
                values.username,
                values.gender_id,
                values.password,
                values.password_confirmation
            );
            if (success) {
                toast({
                    title: "Success!",
                    description: `${values.name} user updated successfully`,
                });
                navigate("/user/view");
            } else {
                throw new Error("Failed to update user");
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

    const renderDropdown = (field: any, data: any, loading: boolean, label: string) => (
        <FormItem>
            <FormLabel>{label}</FormLabel>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between text-left font-light"
                    >
                        {field.value
                            ? data?.find(
                                (item: { id: number; name?: string; year?: string }) => String(item.id) === field.value.toString()
                            )?.[label === "Batch Year" ? "year" : "name"] || ""
                            : loading
                                ? `Loading ${label.toLowerCase()}...`
                                : `Select a ${label.toLowerCase()}`}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
                        <CommandList>
                            <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
                            <CommandGroup>
                                {data?.map((item: { id: number; name?: string; year?: string }) => (
                                    <CommandItem
                                        key={item.id}
                                        onSelect={() => field.onChange(Number(item.id))}
                                    >
                                        {item[label === "Batch Year" ? "year" : "name"]}
                                        {field.value === item.id && (
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
    );

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
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
                                    <Input {...field} />
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
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Controller
                        name="gender_id"
                        control={form.control}
                        render={({ field }) =>
                            renderDropdown(field, genders, gendersLoading, "Gender")
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
                                    <Input
                                        {...field}
                                    />
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
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input {...field} />
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
                        onClick={() => navigate("/user/view")}
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