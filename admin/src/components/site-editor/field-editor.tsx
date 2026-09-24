"use client";

import { Plus, Trash2 } from "lucide-react";
import type { FieldDef } from "@/lib/site-blocks";
import { ImageFieldEditor } from "@/components/site-editor/image-field-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function getNested(obj: Record<string, unknown>, key: string): unknown {
  return obj[key];
}

function setNested(obj: Record<string, unknown>, key: string, value: unknown): Record<string, unknown> {
  return { ...obj, [key]: value };
}

type SimpleField = Extract<FieldDef, { type: "text" | "textarea" | "url" | "checkbox" | "number" | "image" }>;

function isSimpleField(field: FieldDef): field is SimpleField {
  return (
    field.type === "text" ||
    field.type === "textarea" ||
    field.type === "url" ||
    field.type === "checkbox" ||
    field.type === "number" ||
    field.type === "image"
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: SimpleField;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  if (field.type === "image") {
    return (
      <ImageFieldEditor
        label={field.label}
        value={value}
        onChange={(v) => onChange(v)}
        folder={field.folder}
      />
    );
  }

  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
        {field.label}
      </label>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className="space-y-1">
        <Label>{field.label}</Label>
        <Textarea
          value={String(value ?? "")}
          placeholder={field.placeholder}
          rows={4}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <Label>{field.label}</Label>
      <Input
        type={field.type === "number" ? "number" : "text"}
        value={String(value ?? "")}
        placeholder={field.placeholder}
        onChange={(e) => onChange(field.type === "number" ? Number(e.target.value) : e.target.value)}
      />
    </div>
  );
}

function CtaEditor({
  field,
  value,
  onChange,
}: {
  field: Extract<FieldDef, { type: "cta" }>;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const obj = (value as Record<string, unknown>) || {};
  return (
    <div className="space-y-2 rounded-lg border border-border p-3">
      <p className="text-xs font-medium text-muted-foreground">{field.label}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {field.fields.map((sub) =>
          isSimpleField(sub) ? (
            <FieldInput
              key={sub.key}
              field={sub}
              value={obj[sub.key]}
              onChange={(v) => onChange({ ...obj, [sub.key]: v })}
            />
          ) : null
        )}
      </div>
    </div>
  );
}

function RepeaterEditor({
  field,
  value,
  onChange,
}: {
  field: Extract<FieldDef, { type: "repeater" }>;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const items = (Array.isArray(value) ? value : []) as Record<string, unknown>[];

  const updateItem = (index: number, item: Record<string, unknown>) => {
    const next = [...items];
    next[index] = item;
    onChange(next);
  };

  const addItem = () => {
    const blank: Record<string, unknown> = {};
    for (const f of field.fields) {
      if (f.type === "checkbox") blank[f.key] = false;
      else if (f.type === "repeater") blank[f.key] = [];
      else blank[f.key] = "";
    }
    onChange([...items, blank]);
  };

  const removeItem = (index: number) => onChange(items.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{field.label}</Label>
        <Button type="button" size="sm" variant="outline" onClick={addItem}>
          <Plus className="size-3.5" />
          Нэмэх
        </Button>
      </div>
      {items.map((item, index) => (
        <div key={index} className="space-y-2 rounded-lg border border-border bg-muted/20 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {field.itemLabel} #{index + 1}
            </span>
            <Button type="button" size="sm" variant="ghost" className="h-7 text-destructive" onClick={() => removeItem(index)}>
              <Trash2 className="size-3.5" />
            </Button>
          </div>
          <div className="grid gap-2">
            {field.fields.map((sub) =>
              isSimpleField(sub) ? (
                <FieldInput
                  key={sub.key}
                  field={sub}
                  value={item[sub.key]}
                  onChange={(v) => updateItem(index, { ...item, [sub.key]: v })}
                />
              ) : null
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function BlockFieldEditor({
  fields,
  data,
  onChange,
  imageOnly = false,
  excludeImages = false,
}: {
  fields: FieldDef[];
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
  imageOnly?: boolean;
  excludeImages?: boolean;
}) {
  let visible = fields;
  if (imageOnly) visible = fields.filter((f) => f.type === "image");
  else if (excludeImages) visible = fields.filter((f) => f.type !== "image");

  return (
    <div className="space-y-4">
      {visible.map((field) => {
        const value = getNested(data, field.key);

        if (field.type === "cta") {
          if (imageOnly) return null;
          return (
            <CtaEditor
              key={field.key}
              field={field}
              value={value}
              onChange={(v) => onChange(setNested(data, field.key, v))}
            />
          );
        }

        if (field.type === "repeater") {
          if (imageOnly) {
            const imageSub = field.fields.find((f) => f.type === "image");
            if (!imageSub || !isSimpleField(imageSub)) return null;
            const items = (Array.isArray(value) ? value : []) as Record<string, unknown>[];
            return (
              <div key={field.key} className="space-y-3">
                <Label>{field.label} — {imageSub.label}</Label>
                {items.map((item, index) => (
                  <div key={index} className="rounded-lg border border-border p-3">
                    <p className="mb-2 text-xs text-muted-foreground">{field.itemLabel} #{index + 1}</p>
                    <FieldInput
                      field={imageSub}
                      value={item[imageSub.key]}
                      onChange={(v) => {
                        const next = [...items];
                        next[index] = { ...item, [imageSub.key]: v };
                        onChange(setNested(data, field.key, next));
                      }}
                    />
                  </div>
                ))}
              </div>
            );
          }
          return (
            <RepeaterEditor
              key={field.key}
              field={field}
              value={value}
              onChange={(v) => onChange(setNested(data, field.key, v))}
            />
          );
        }

        if (isSimpleField(field)) {
          return (
            <div key={field.key} className={field.fullWidth ? "col-span-full" : ""}>
              <FieldInput
                field={field}
                value={value}
                onChange={(v) => onChange(setNested(data, field.key, v))}
              />
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
