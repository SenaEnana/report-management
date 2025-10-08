"use client";

import React from "react";
import { Controller, Control } from "react-hook-form";
import {
    FormItem,
} from "@/components/ui/form";
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

interface Option {
    id: number | string;
    name: string;
}

interface DropdownProps {
    name: string;
    label: string;
    control: Control<any>;
    options: Option[];
}

const DropdownField = React.forwardRef<HTMLInputElement, DropdownProps>(
    ({ name, label, options, control }) => (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <FormItem>
                    <Label className={cn(fieldState.error && "text-red-500 dark:text-red-900")}>{label}</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                className="w-full justify-between text-left font-light"
                            >
                                {field.value
                                    ? options.find((opt) => opt.id === field.value)?.name
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
                                        {options.map((opt) => (
                                            <CommandItem key={opt.id} onSelect={() => field.onChange(Number(opt.id))}>
                                                {opt.name}
                                                {field.value === opt.id && (
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
    )
);

DropdownField.displayName = "DropdownField";

export default DropdownField;