import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { getUserByIdApi } from "@/services/UserService";
import { assignCampusApi } from "@/services/UserService";
import { getCampusApi } from "@/services/CampusService";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const formSchema = z.object({
    campus_ids: z.array(z.number({ invalid_type_error: "Campus is required" })).min(1, "Campus is required"),
});

export default function AssignCampusForm() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const userId = searchParams.get("userId");
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userName, setUserName] = useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            campus_ids: [],
        },
    });
    useEffect(() => {
        if (userId) {
            getUserByIdApi(userId)
                .then((user) => setUserName(user.data.name))
                .catch(() => {
                    toast({ title: "Error", description: "Failed to fetch user details.", variant: "destructive" });
                    navigate(-1);
                });
        } else {
            toast({ title: "Error", description: "User ID is missing.", variant: "destructive" });
            navigate(-1);
        }
    }, [userId, toast, navigate]);

    const { data: campuses = [] } = useQuery({
        queryKey: ["campuses"],
        queryFn: getCampusApi,
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!userId) {
            toast({ title: "Error", description: "User ID is required.", variant: "destructive" });
            return;
        }
        setIsSubmitting(true);
        try {
            await assignCampusApi(userId, values.campus_ids);
            toast({ title: "Success", description: "Campus assigned successfully!" });
            navigate(-1);
        } catch (error: any) {
            const errorMessage =
                error.message || "Failed to create faculty. Please try again.";
            toast({ title: "Error", description: errorMessage, variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="p-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormItem>
                        <FormLabel>User Name</FormLabel>
                        <FormControl>
                            <Input value={userName} readOnly />
                        </FormControl>
                    </FormItem>

                    <Controller
                        name="campus_ids"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <Label className={cn(fieldState.error && "text-red-500 dark:text-red-900")}>Campus</Label>                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full justify-between text-left font-light"
                                        >
                                            {field.value
                                                ? campuses?.find(
                                                    (campus: { id: number; name: string }) => field.value.includes(campus.id)
                                                )?.name
                                                : "Select a campus"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Search campus..." />
                                            <CommandList>
                                                <CommandEmpty>No campuses found.</CommandEmpty>
                                                <CommandGroup>
                                                    {campuses?.map((campus: { id: number; name: string }) => (
                                                        <CommandItem
                                                            key={campus.id}
                                                            onSelect={() => field.onChange([campus.id])}
                                                        >
                                                            {campus.name}
                                                            {field.value?.includes(campus.id) && (
                                                                <Check className="ml-auto h-4 w-4 opacity-100" />
                                                            )}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                {fieldState.error && <p className="text-[0.8rem] font-medium text-red-500 dark:text-red-900">{fieldState.error.message}</p>}
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => navigate("/user/view")} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}