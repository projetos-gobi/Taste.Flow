"use client"

import { Check, ChevronsUpDown, X } from "lucide-react"
import * as React from "react"

import { cn } from "@/src/lib/utils"
import { Button } from "@/src/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/src/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover"
import { Badge } from "@/src/components/ui/badge"
import { Label } from "@/src/components/ui/label"

export interface IOption {
  id: string
  name: string
}

interface MultiSelectFieldProps {
  label: string;
  options: IOption[];
  selectedOptions: string[];
  onSelectionChange: (selected: string[]) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

export function MultiSelectField({
  label,
  options,
  selectedOptions,
  onSelectionChange,
  placeholder = "Selecione as opções",
  required = false,
  className,
  disabled
}: MultiSelectFieldProps) {
  const [open, setOpen] = React.useState(false)

  const removeOption = (optionIdToRemove: string) => {
    onSelectionChange(selectedOptions.filter((id) => id !== optionIdToRemove))
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label className="font-nunito font-medium text-gray-900">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="w-full h-10 bg-white border-gray-200 justify-between font-nunito font-normal text-left overflow-hidden"
          >
            <div 
              className="flex gap-1 flex-1 min-w-0 max-w-full overflow-x-auto whitespace-nowrap"
              style={{
                scrollbarWidth: "none", 
                msOverflowStyle: "none"
              }}
            >
              {selectedOptions.length > 0 ? (
                selectedOptions.map((selectedId) => {
                  const option = options.find((o) => o.id === selectedId)
                  if (!option) return null
                  return (
                    <Badge
                      key={option.id}
                      variant="secondary"
                      className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200"
                    >
                      {option.name}
                      <span
                        role="button"
                        tabIndex={0}
                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            removeOption(option.id)
                          }
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onClick={() => removeOption(option.id)}
                      >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </span>
                    </Badge>
                  )
                })
              ) : (
                <span className="text-gray-500">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-white" align="start">
          <Command>
            <CommandInput placeholder="Buscar opções..." />
            <CommandList>
              <CommandEmpty>Nenhuma opção encontrada.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selectedOptions.includes(option.id)
                  return (
                    <CommandItem
                      key={option.id}
                      onSelect={() => {
                        if (isSelected) {
                          onSelectionChange(selectedOptions.filter((id) => id !== option.id))
                        } else {
                          onSelectionChange([...selectedOptions, option.id])
                        }
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
