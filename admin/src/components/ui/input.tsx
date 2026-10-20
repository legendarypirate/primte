import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

/** Empty and in-progress text ("", "12.") still match a parent that stored Number(raw). */
function keepsTypedText(raw: string, value: unknown) {
  if (raw === "" || raw === "-" || raw === "." || raw === "-.") {
    return Number(value) === 0 || value === "" || value == null
  }
  if (!/^-?\d+(\.\d+)?$/.test(raw)) return true
  return Number(raw) === Number(value)
}

function Input({ className, type, value, onChange, onBlur, ...props }: React.ComponentProps<"input">) {
  const isNumber = type === "number"
  const [typed, setTyped] = React.useState<string | null>(null)
  const [tracked, setTracked] = React.useState(value)

  if (isNumber && value !== tracked) {
    setTracked(value)
    if (typed !== null && !keepsTypedText(typed, value)) setTyped(null)
  }

  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      value={isNumber && typed !== null ? typed : value}
      onChange={(event) => {
        if (!isNumber) {
          onChange?.(event)
          return
        }
        const raw = event.target.value
        if (raw !== "" && !/^-?\d*\.?\d*$/.test(raw)) return
        setTyped(raw)
        if (raw === "" || /^-?\d+(\.\d+)?$/.test(raw)) onChange?.(event)
      }}
      onBlur={(event) => {
        if (isNumber && typed !== null && typed !== "" && !/^-?\d+(\.\d+)?$/.test(typed)) setTyped(null)
        onBlur?.(event)
      }}
      className={cn(
        "h-9 w-full min-w-0 rounded-md border border-input bg-background/80 px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground hover:border-primary/50 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:hover:border-primary/40 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
