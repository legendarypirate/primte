"use client";

import { type ComponentProps } from "react";
import {
  Check,
  PackageCheck,
  Pencil,
  Trash2,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ActionKind = "edit" | "delete" | "topup" | "approve" | "cancel" | "deliver";

const ACTIONS: Record<
  ActionKind,
  { icon: LucideIcon; label: string; variant: ComponentProps<typeof Button>["variant"]; className?: string }
> = {
  edit: { icon: Pencil, label: "Засах", variant: "outline", className: "text-muted-foreground shadow-sm" },
  delete: {
    icon: Trash2,
    label: "Устгах",
    variant: "default",
    className: "border-transparent bg-red-400 text-white shadow-sm hover:bg-red-500 hover:text-white",
  },
  topup: { icon: Wallet, label: "Цэнэглэх", variant: "outline" },
  approve: { icon: Check, label: "Батлах", variant: "default" },
  cancel: { icon: X, label: "Цуцлах", variant: "destructive" },
  deliver: { icon: PackageCheck, label: "Хүргэсэн", variant: "outline" },
};

export function IconActionButton({
  action,
  className,
  ...props
}: Omit<ComponentProps<typeof Button>, "children" | "size" | "variant"> & { action: ActionKind }) {
  const { icon: Icon, label, variant, className: actionClass } = ACTIONS[action];
  return (
    <Button
      type="button"
      size="icon-sm"
      variant={variant}
      title={label}
      aria-label={label}
      className={cn("size-8 shrink-0 rounded-md", actionClass, className)}
      {...props}
    >
      <Icon />
    </Button>
  );
}

export function ActionCell({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center gap-1", className)} {...props}>
      {children}
    </div>
  );
}
