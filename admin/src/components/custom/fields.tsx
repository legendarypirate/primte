"use client";

import * as React from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type InputProps = React.ComponentProps<typeof Input>;
type TextareaProps = React.ComponentProps<typeof Textarea>;

const fieldClass = cn(
  "border-input bg-background/80",
  "hover:border-primary/50",
  "focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/30",
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
  "dark:bg-input/30 dark:hover:border-primary/40"
);

const selectFieldClass = cn(
  "border-input bg-background/80",
  "hover:border-primary/50",
  "focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/30",
  "data-popup-open:border-primary data-popup-open:ring-3 data-popup-open:ring-primary/30",
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
  "dark:bg-input/30 dark:hover:border-primary/40"
);

export const MInput = React.forwardRef<HTMLInputElement, InputProps>(function MInput(
  { className, type, onFocus, onChange, ...props },
  ref
) {
  return (
    <Input
      ref={ref}
      type={type}
      className={cn(fieldClass, className)}
      {...props}
      onFocus={(event) => {
        onFocus?.(event);
        if (type === "number") event.currentTarget.select();
      }}
      onChange={(event) => {
        if (type === "number" && /^0\d/.test(event.currentTarget.value)) {
          event.currentTarget.value = event.currentTarget.value.replace(/^0+/, "");
        }
        onChange?.(event);
      }}
    />
  );
});

export function MTextarea({ className, rows = 3, ...props }: TextareaProps) {
  return <Textarea rows={rows} className={cn(fieldClass, "min-h-20 resize-y", className)} {...props} />;
}

export interface MPasswordProps extends Omit<InputProps, "type"> {
  isShow?: boolean;
}

export const MPassword = React.forwardRef<HTMLInputElement, MPasswordProps>(function MPassword(
  { isShow = true, className, ...props },
  ref
) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="relative w-full">
      <Input
        ref={ref}
        type={visible && isShow ? "text" : "password"}
        className={cn(fieldClass, isShow && "pr-9", className)}
        {...props}
      />
      {isShow && (
        <div className="absolute inset-y-0 right-2 flex items-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            tabIndex={-1}
            aria-label={visible ? "Нууц үг нуух" : "Нууц үг харах"}
            onClick={() => setVisible((v) => !v)}
            className="size-7 cursor-pointer p-0 text-muted-foreground hover:bg-primary/10 hover:text-primary"
          >
            {visible ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
          </Button>
        </div>
      )}
    </div>
  );
});

export interface MSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

const EMPTY_VALUE = "__empty__";

export function MSelect({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Сонгоно уу",
  disabled,
  className,
  triggerClassName,
  id,
  name,
  "aria-invalid": ariaInvalid,
}: {
  options: MSelectOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  id?: string;
  name?: string;
  "aria-invalid"?: boolean;
}) {
  const labelByValue = React.useMemo(() => {
    const map = new Map<string, string>();
    for (const option of options) {
      map.set(option.value === "" ? EMPTY_VALUE : option.value, option.label);
    }
    return map;
  }, [options]);

  const toInternal = (next: string | null | undefined) => {
    if (next == null || next === "") return next === undefined ? undefined : EMPTY_VALUE;
    return next;
  };

  const fromInternal = (next: string | null) => {
    if (next == null || next === EMPTY_VALUE) return "";
    return next;
  };

  const controlledValue =
    value === undefined && defaultValue !== undefined ? undefined : toInternal(value ?? "");

  return (
    <Select
      value={controlledValue}
      defaultValue={controlledValue === undefined ? toInternal(defaultValue) : undefined}
      onValueChange={(next) => onValueChange?.(fromInternal(next))}
      disabled={disabled}
      name={name}
    >
      <SelectTrigger
        id={id}
        aria-invalid={ariaInvalid}
        className={cn("w-full cursor-pointer", selectFieldClass, triggerClassName, className)}
      >
        <SelectValue placeholder={placeholder}>
          {(selected) => {
            if (selected == null || selected === "") {
              return <span className="text-muted-foreground">{placeholder}</span>;
            }
            return labelByValue.get(String(selected)) ?? fromInternal(String(selected));
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="ring-1 ring-primary/15">
        {options.map((option) => {
          const itemValue = option.value === "" ? EMPTY_VALUE : option.value;
          return (
            <SelectItem
              key={itemValue}
              value={itemValue}
              disabled={option.disabled}
              className="focus:bg-primary/10 focus:text-primary"
            >
              {option.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

export { fieldClass, selectFieldClass };
