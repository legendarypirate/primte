import { redirect } from "next/navigation";

export default function DivisionsRedirect() {
  redirect("/match-types?tab=divisions");
}
