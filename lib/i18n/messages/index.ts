import type { Locale } from "../config";
import type { Messages } from "../messages-schema";
import { en } from "./en";
import { es } from "./es";
import { de } from "./de";
import { fr } from "./fr";
import { it } from "./it";
import { ja } from "./ja";
import { ko } from "./ko";
import { tr } from "./tr";
import { zh } from "./zh";

export const messages: Record<Locale, Messages> = {
  en,
  es,
  de,
  fr,
  it,
  ja,
  ko,
  tr,
  zh,
};

export function getMessages(locale: Locale): Messages {
  return messages[locale] ?? messages.en;
}

export type { Messages };
