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
  { icon: LucideIcon; label: string; variant: ComponentProps<typeof Button>["variant"] }
> = {
  edit: { icon: Pencil, label: "Засах", variant: "outline" },
  delete: { icon: Trash2, label: "Устгах", variant: "destructive" },
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
  const { icon: Icon, label, variant } = ACTIONS[action];
  return (
    <Button
      type="button"
      size="icon-sm"
      variant={variant}
      title={label}
      aria-label={label}
      className={cn("shrink-0", className)}
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
