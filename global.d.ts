import type en from "@/messages/en";
import type { Locale } from "@/lib/types";
declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof en;
  }
}
