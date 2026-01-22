"use client";

import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AIRPORTS } from "@/lib/airports";

interface CityPickerProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export function CityPicker({ value, onChange, label }: CityPickerProps) {
  const [open, setOpen] = useState(false);

  const selectedAirport = AIRPORTS.find((a) => a.code === value);

  return (
    <div className="space-y-1 flex flex-col">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between p-0 h-9 hover:bg-transparent text-base font-medium text-slate-900"
          >
            {selectedAirport
              ? `${selectedAirport.code} - ${selectedAirport.city}`
              : `Select...`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder={`Search ${label}...`} />
            <CommandList>
              <CommandEmpty>No airport found.</CommandEmpty>
              <CommandGroup>
                {AIRPORTS.map((framework) => (
                  <CommandItem
                    key={framework.code}
                    value={`${framework.city} ${framework.name} ${framework.code}`}
                    onSelect={(currentValue: string) => {
                       onChange(framework.code);
                       setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === framework.code ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold">{framework.city} ({framework.code})</span>
                      <span className="text-xs text-muted-foreground">{framework.name}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
