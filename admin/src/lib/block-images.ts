import type { BlockSchema, FieldDef } from "@/lib/site-blocks";

function collectFields(fields: FieldDef[], prefix = ""): { key: string; label: string; folder?: string }[] {
  const out: { key: string; label: string; folder?: string }[] = [];
  for (const f of fields) {
    if (f.type === "image") {
      out.push({ key: prefix ? `${prefix}.${f.key}` : f.key, label: f.label, folder: f.folder });
    }
    if (f.type === "repeater") {
      // repeater items use flat keys in data, handled separately in inspector
      for (const sub of f.fields) {
        if (sub.type === "image") {
          out.push({ key: `${f.key}[].${sub.key}`, label: `${f.itemLabel} → ${sub.label}`, folder: sub.folder });
        }
      }
    }
  }
  return out;
}

export function getBlockImageFields(schema: BlockSchema | undefined) {
  if (!schema) return [];
  return collectFields(schema.fields);
}

export function schemaHasImages(schema: BlockSchema | undefined) {
  return getBlockImageFields(schema).length > 0;
}
