"use client";

import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

function PaginationLink({
  className,
  isActive,
  size = "icon",
  disabled,
  onClick,
  children,
}: {
  className?: string;
  isActive?: boolean;
  size?: React.ComponentProps<typeof Button>["size"];
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant={isActive ? "outline" : "ghost"}
      size={size}
      disabled={disabled}
      aria-current={isActive ? "page" : undefined}
      className={cn(className)}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function PaginationPrevious({
  className,
  text = "Өмнөх",
  disabled,
  onClick,
}: {
  className?: string;
  text?: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <PaginationLink
      size="default"
      disabled={disabled}
      onClick={onClick}
      className={cn("pl-2", className)}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">{text}</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  text = "Дараах",
  disabled,
  onClick,
}: {
  className?: string;
  text?: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <PaginationLink
      size="default"
      disabled={disabled}
      onClick={onClick}
      className={cn("pr-2", className)}
    >
      <span className="hidden sm:block">{text}</span>
      <ChevronRightIcon />
    </PaginationLink>
  );
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-8 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
