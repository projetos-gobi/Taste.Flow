"use client"

import { Check, ChevronsUpDown, X } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

interface MultiSelectFieldProps {
  label: string
  options: string[]
  selectedOptions: string[]
  onSelectionChange: (selected: string[]) => void
  placeholder?: string
  required?: boolean
  className?: string
}

export function MultiSelectField({
  label,
  options,
  selectedOptions,
  onSelectionChange,
  placeholder = "Selecione as opções",
  required = false,
  className,
}: MultiSelectFieldProps) {
  const [open, setOpen] = React.useState(false)

  const removeOption = (optionToRemove: string) => {
    onSelectionChange(selectedOptions.filter((option) => option !== optionToRemove))
  }

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
            className="w-full h-12 bg-white border-gray-200 justify-between font-nunito font-normal text-left"
          >
            <div className="flex flex-wrap gap-1 flex-1 min-w-0">
              {selectedOptions.length > 0 ? (
                selectedOptions.map((option) => (
                  <Badge
                    key={option}
                    variant="secondary"
                    className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200"
                  >
                    {option}
                    <button
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          removeOption(option)
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      onClick={() => removeOption(option)}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                ))
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
                {options.map((option) => (
                  <CommandItem
                    key={option}
                    onSelect={() => {
                      if (selectedOptions.includes(option)) {
                        onSelectionChange(selectedOptions.filter((item) => item !== option))
                      } else {
                        onSelectionChange([...selectedOptions, option])
                      }
                    }}
                  >
                    <Check
                      className={cn("mr-2 h-4 w-4", selectedOptions.includes(option) ? "opacity-100" : "opacity-0")}
                    />
                    {option}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
