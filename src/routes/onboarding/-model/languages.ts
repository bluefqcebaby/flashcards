import {
  formatLanguageLabel,
  type LanguageOption,
} from "@/routes/onboarding/-model/contracts"

export const languageCatalog: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "it", name: "Italian", nativeName: "Italiano" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська" },
  { code: "ka", name: "Georgian", nativeName: "ქართული" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe" },
  { code: "pl", name: "Polish", nativeName: "Polski" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands" },
  { code: "sv", name: "Swedish", nativeName: "Svenska" },
  { code: "he", name: "Hebrew", nativeName: "עברית" },
]

const languageCatalogMap = new Map(
  languageCatalog.map((language) => [language.code, language]),
)

export function getLanguageOption(code: string) {
  return languageCatalogMap.get(code) ?? null
}

export function isValidLanguageCode(code: string) {
  return languageCatalogMap.has(code)
}

export function getLanguageSearchLabel(language: LanguageOption) {
  return `${formatLanguageLabel(language)} ${language.code}`
}
