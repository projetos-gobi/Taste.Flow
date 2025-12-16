"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"

import { cn } from "@/src/lib/utils"
import { Button } from "@/src/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/src/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover"
import { Label } from "@/src/components/ui/label"

export interface IOption {
  id: string
  name: string
}

interface SelectFieldProps {
  label?: string;
  options: IOption[];
  value?: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  height?: string;
}

export function Select({ label, options, value = null, onChange, placeholder = "Selecione uma opção", className, disabled, height = "h-12" }: SelectFieldProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className="font-nunito font-medium text-gray-900">
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full bg-transparent border-0 rounded-none justify-between font-nunito font-light text-gray-900 focus:ring-0 focus:border-0 overflow-hidden hover:bg-transparent",
              height // aplica a altura definida
            )}
          >
            <div className="flex gap-1 flex-1 min-w-0 max-w-full whitespace-nowrap">
              {value ? (
                <span className="text-gray-900">{options.find(o => o.id === value)?.name}</span>
              ) : (
                <span className="text-gray-500">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-white max-h-[300px] overflow-auto" align="start">
          <Command>
            <CommandInput placeholder="Buscar opções..." />
            <CommandList>
              <CommandEmpty>Nenhuma opção encontrada.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = value === option.id
                  return (
                    <CommandItem
                      key={option.id}
                      value={option.id}
                      onSelect={() => {
                        onChange(isSelected ? null : option.id)
                        setOpen(false)
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
                      {option.name}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
