"use client";

import React, { useState } from "react";
import { Check, ChevronsUpDown, MapPin, Circle } from "lucide-react";
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
  className?: string;
  showIcon?: boolean;
}

export function CityPicker({ 
  value, 
  onChange, 
  label, 
  className, 
  showIcon = true 
}: CityPickerProps) {
  const [open, setOpen] = useState(false);

  const selectedAirport = AIRPORTS.find((a) => a.code === value);

  return (
    <div className={cn("space-y-1 flex flex-col", className)}>
      {!showIcon && (
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {label}
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-start p-0 h-auto hover:bg-transparent text-left",
               // If styling is passed via className, we might want to override basic button styles or rely on parent
               // using simple flex behavior.
               // Let's ensure text formatting is consistent.
               !className && "text-base font-medium text-slate-900"
            )}
          >
            <div className="flex items-center gap-3 w-full overflow-hidden">
             {showIcon && (
                <div className="shrink-0 text-slate-400">
                   {label === 'From' ? <Circle className="w-5 h-5 text-slate-400" /> : <MapPin className="w-5 h-5 text-slate-400" />}
                </div>
              )}
              <div className="flex flex-col truncate">
                <span className={cn(
                  "block truncate font-semibold text-slate-900 text-lg leading-tight",
                  showIcon ? "text-lg" : "text-base"
                )}>
                    {selectedAirport ? selectedAirport.city : label}
                </span>
                <span className="text-sm text-slate-500 truncate font-normal">
                    {selectedAirport ? `${selectedAirport.code} - ${selectedAirport.name}` : `Select ${label}`}
                </span>
              </div>
            </div>
            
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
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
                       // CommandItem value is composite for searching, but we want the code
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
