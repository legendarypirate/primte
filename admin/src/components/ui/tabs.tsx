"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex items-center justify-start text-muted-foreground",
  {
    variants: {
      variant: {
        default:
          "w-fit rounded-lg bg-muted p-[3px] group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col",
        line:
          "w-full flex-wrap gap-1 border-b border-border bg-transparent p-0 group-data-horizontal/tabs:h-auto",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex items-center justify-center gap-2 text-sm font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        // Default (pill) variant
        "group-data-[variant=default]/tabs-list:h-[calc(100%-1px)] group-data-[variant=default]/tabs-list:flex-1 group-data-[variant=default]/tabs-list:rounded-md group-data-[variant=default]/tabs-list:border group-data-[variant=default]/tabs-list:border-transparent group-data-[variant=default]/tabs-list:px-2.5 group-data-[variant=default]/tabs-list:py-1 group-data-[variant=default]/tabs-list:text-foreground/70 group-data-[variant=default]/tabs-list:hover:text-foreground group-data-[variant=default]/tabs-list:data-active:bg-background group-data-[variant=default]/tabs-list:data-active:text-foreground group-data-[variant=default]/tabs-list:data-active:shadow-sm dark:group-data-[variant=default]/tabs-list:data-active:bg-input/40 dark:group-data-[variant=default]/tabs-list:data-active:border-input",
        // Line variant
        "group-data-[variant=line]/tabs-list:-mb-px group-data-[variant=line]/tabs-list:rounded-none group-data-[variant=line]/tabs-list:border-b-2 group-data-[variant=line]/tabs-list:border-transparent group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:px-4 group-data-[variant=line]/tabs-list:py-2.5 group-data-[variant=line]/tabs-list:text-muted-foreground group-data-[variant=line]/tabs-list:hover:text-foreground group-data-[variant=line]/tabs-list:data-active:border-primary group-data-[variant=line]/tabs-list:data-active:bg-transparent group-data-[variant=line]/tabs-list:data-active:text-primary group-data-[variant=line]/tabs-list:data-active:font-semibold group-data-[variant=line]/tabs-list:data-active:shadow-none dark:group-data-[variant=line]/tabs-list:data-active:border-primary dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent dark:group-data-[variant=line]/tabs-list:data-active:text-primary",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
