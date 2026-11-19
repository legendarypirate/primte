"use client";

import * as React from "react";
import { CheckIcon, ChevronDownIcon, EyeIcon, EyeOffIcon, SearchIcon } from "lucide-react";
import { Combobox } from "@base-ui/react/combobox";
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
  searchText?: string;
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
  searchable = false,
  searchPlaceholder = "Хайх...",
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
  searchable?: boolean;
  searchPlaceholder?: string;
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

  if (searchable) {
    return (
      <SearchSelect
        options={options}
        value={value ?? ""}
        onValueChange={(next) => onValueChange?.(next)}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        triggerClassName={triggerClassName}
        id={id}
        name={name}
        searchPlaceholder={searchPlaceholder}
        ariaInvalid={ariaInvalid}
      />
    );
  }

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

function SearchSelect({
  options,
  value,
  onValueChange,
  placeholder,
  disabled,
  className,
  triggerClassName,
  id,
  name,
  searchPlaceholder,
  ariaInvalid,
}: {
  options: MSelectOption[];
  value: string;
  onValueChange?: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  id?: string;
  name?: string;
  searchPlaceholder: string;
  ariaInvalid?: boolean;
}) {
  const selected = React.useMemo(
    () => options.find((option) => option.value === value && option.value !== "") ?? null,
    [options, value]
  );

  return (
    <Combobox.Root
      items={options}
      value={selected}
      onValueChange={(next) => onValueChange?.(next?.value ?? "")}
      itemToStringLabel={(item) => item.label}
      itemToStringValue={(item) => item.value}
      isItemEqualToValue={(a, b) => a.value === b.value}
      filter={(item, query) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        const haystack = `${item.searchText || ""} ${item.label} ${item.value}`.toLowerCase();
        return haystack.includes(q);
      }}
      autoHighlight
      disabled={disabled}
      name={name}
    >
      <Combobox.Trigger
        id={id}
        disabled={disabled}
        aria-invalid={ariaInvalid}
        className={cn(
          "flex h-9 w-full cursor-pointer items-center justify-between gap-1.5 rounded-md px-2.5 py-2 text-sm outline-none select-none disabled:cursor-not-allowed disabled:opacity-50",
          selectFieldClass,
          triggerClassName,
          className
        )}
      >
        <span className={cn("min-w-0 flex-1 truncate text-left", !selected && "text-muted-foreground")}>
          {selected?.label || placeholder}
        </span>
        <Combobox.Icon className="flex shrink-0 items-center">
          <ChevronDownIcon className="size-4 text-muted-foreground" />
        </Combobox.Icon>
      </Combobox.Trigger>
      <Combobox.Portal>
        <Combobox.Positioner className="isolate z-50" side="bottom" sideOffset={4} align="start">
          <Combobox.Popup className="isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-primary/15 duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
            <div className="border-b border-border p-1.5">
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Combobox.Input
                  placeholder={searchPlaceholder}
                  className={cn(fieldClass, "h-8 w-full rounded-md pr-2 pl-7 text-sm outline-none")}
                />
              </div>
            </div>
            <Combobox.Empty className="px-3 py-2 text-sm text-muted-foreground">Олдсонгүй.</Combobox.Empty>
            <Combobox.List className="max-h-64 overflow-y-auto p-1">
              {(item: MSelectOption) => (
                <Combobox.Item
                  key={item.value || EMPTY_VALUE}
                  value={item}
                  disabled={item.disabled}
                  className="relative flex w-full cursor-pointer items-center rounded-md py-1.5 pr-8 pl-2 text-sm outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-primary/10 data-highlighted:text-primary"
                >
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  <Combobox.ItemIndicator className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
                    <CheckIcon className="size-4" />
                  </Combobox.ItemIndicator>
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}

export { fieldClass, selectFieldClass };
