"use client";

import * as React from "react";
import { Column } from "@tanstack/react-table";
import { PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface DataTableRadioFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

export function DataTableRadioFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableRadioFilterProps<TData, TValue>) {
  const selectedValue = column?.getFilterValue() as string;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle className="mr-2 h-4 w-4" />
          {title}
          {selectedValue && (
            <>
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                1
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                >
                  {options.find((option) => option.value === selectedValue)
                    ?.label || selectedValue}
                </Badge>
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>결과가 없습니다.</CommandEmpty>
            <CommandGroup>
              <RadioGroup
                value={selectedValue || ""}
                onValueChange={(value) => {
                  column?.setFilterValue(
                    value === selectedValue ? undefined : value
                  );
                }}
              >
                {options.map((option) => {
                  const isSelected = selectedValue === option.value;
                  return (
                    <CommandItem
                      key={option.value}
                      className={cn(
                        "flex items-center space-x-2",
                        isSelected && "bg-muted/50 text-foreground font-medium"
                      )}
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={option.value}
                        className="h-4 w-4"
                      />
                      <Label
                        htmlFor={option.value}
                        className={cn(
                          "flex-1 cursor-pointer",
                          isSelected && "font-semibold"
                        )}
                      >
                        {option.icon && (
                          <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                        )}
                        <span>{option.label}</span>
                      </Label>
                    </CommandItem>
                  );
                })}
              </RadioGroup>
            </CommandGroup>
            {selectedValue && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    필터 초기화
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
