import { routing } from "@/i18n/routing";
import { redirect } from "next/navigation";

// Root redirect to default locale
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
