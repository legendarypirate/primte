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
        "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
