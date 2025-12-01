"use client";

import React from "react";
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
import { Label } from "@/components/ui/label";

interface Option {
  id: string | number;
  name: string;
}

interface DropdownProps {
  name: string;
  label: string;
  value: string | number;
  onChange: (value: any) => void;
  options: Option[];
}

const DropdownField: React.FC<DropdownProps> = ({
  label,
  value,
  onChange,
  options,
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <Label>{label}</Label>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" className="w-full justify-between">
            {value
              ? options.find((opt) => opt.id === value)?.name
              : `Select ${label}`}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={`Search ${label}...`} />

            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>

              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={opt.id}
                    onSelect={() => onChange(opt.id)}
                  >
                    {opt.name}

                    {value === opt.id && (
                      <Check className="ml-auto h-4 w-4 opacity-100" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DropdownField;
