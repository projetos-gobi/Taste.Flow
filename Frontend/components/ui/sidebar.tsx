"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const sidebarVariants = cva("group relative flex flex-col h-full", {
  variants: {
    variant: {
      default: "bg-background border-r",
    },
    collapsible: {
      icon: "w-[var(--sidebar-collapsed-width)] data-[open=true]:w-[var(--sidebar-width)] transition-[width]",
      full: "w-[var(--sidebar-width)] data-[open=false]:w-[var(--sidebar-collapsed-width)] transition-[width]",
      none: "w-[var(--sidebar-width)]",
    },
  },
  defaultVariants: {
    variant: "default",
    collapsible: "none",
  },
})

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof sidebarVariants> {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
}

interface SidebarContextValue {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  collapsible: "icon" | "full" | "none"
}

const SidebarContext = React.createContext<SidebarContextValue>({
  open: false,
  setOpen: () => undefined,
  collapsible: "none",
})

export function useSidebarContext() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebarContext must be used within a SidebarProvider")
  }
  return context
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, children, variant, collapsible = "none", open, onOpenChange, defaultOpen = true, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen)

    const handleOpenChange = React.useCallback(
      (value: boolean) => {
        setIsOpen(value)
        onOpenChange?.(value)
      },
      [onOpenChange],
    )

    const value = React.useMemo(
      () => ({
        open: open !== undefined ? open : isOpen,
        setOpen: handleOpenChange,
        collapsible,
      }),
      [open, isOpen, handleOpenChange, collapsible],
    )

    React.useEffect(() => {
      document.documentElement.style.setProperty("--sidebar-width", "240px")
      document.documentElement.style.setProperty("--sidebar-collapsed-width", "64px")
    }, [])

    return (
      <SidebarContext.Provider value={value}>
        <div
          ref={ref}
          data-open={value.open}
          className={cn(sidebarVariants({ variant, collapsible, className }))}
          data-collapsible={collapsible}
          data-sidebar=""
          {...props}
        >
          {children}
        </div>
      </SidebarContext.Provider>
    )
  },
)
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("border-b", className)} data-sidebar-header="" {...props} />
  ),
)
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex-1 overflow-auto", className)} data-sidebar-content="" {...props} />
  ),
)
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("border-t", className)} data-sidebar-footer="" {...props} />
  ),
)
SidebarFooter.displayName = "SidebarFooter"

const SidebarMenu = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-1 p-2", className)} data-sidebar-menu="" {...props} />
  ),
)
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} data-sidebar-menu-item="" {...props} />
  ),
)
SidebarMenuItem.displayName = "SidebarMenuItem"

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean
  tooltip?: string
  asChild?: boolean
}

const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, isActive, tooltip, asChild = false, children, ...props }, ref) => {
    const { collapsible, open } = useSidebarContext()

    if (asChild) {
      return (
        <React.Fragment>
          {React.cloneElement(children as React.ReactElement, {
            "data-active": isActive,
            "data-tooltip": tooltip,
            className: cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isActive && "bg-accent text-accent-foreground",
              className,
            ),
            "data-sidebar-menu-button": "",
          })}
          {collapsible === "icon" && !open && tooltip && (
            <div
              className={cn(
                "absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 rounded-md bg-accent px-2 py-1 text-xs font-medium text-accent-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100",
              )}
              data-sidebar-menu-tooltip=""
            >
              {tooltip}
            </div>
          )}
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        <button
          ref={ref}
          data-active={isActive}
          data-tooltip={tooltip}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            isActive && "bg-accent text-accent-foreground",
            className,
          )}
          data-sidebar-menu-button=""
          {...props}
        >
          {children}
        </button>
        {collapsible === "icon" && !open && tooltip && (
          <div
            className={cn(
              "absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 rounded-md bg-accent px-2 py-1 text-xs font-medium text-accent-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100",
            )}
            data-sidebar-menu-tooltip=""
          >
            {tooltip}
          </div>
        )}
      </React.Fragment>
    )
  },
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => {
    const { setOpen, open } = useSidebarContext()

    return (
      <button ref={ref} onClick={() => setOpen(!open)} className={cn("", className)} data-sidebar-trigger="" {...props}>
        {children}
      </button>
    )
  },
)
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarRail = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { collapsible } = useSidebarContext()

    if (collapsible === "none") {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "absolute right-0 top-0 h-full w-1 cursor-col-resize bg-transparent transition-colors hover:bg-border",
          className,
        )}
        data-sidebar-rail=""
        {...props}
      />
    )
  },
)
SidebarRail.displayName = "SidebarRail"

const SidebarInset = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("", className)} data-sidebar-inset="" {...props} />,
)
SidebarInset.displayName = "SidebarInset"

interface SidebarProviderProps {
  children: React.ReactNode
  defaultOpen?: boolean
}

function SidebarProvider({ children, defaultOpen = true }: SidebarProviderProps) {
  const [open, setOpen] = React.useState(defaultOpen)

  return (
    <SidebarContext.Provider
      value={{
        open,
        setOpen,
        collapsible: "icon",
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarRail,
  SidebarInset,
  SidebarProvider,
}
