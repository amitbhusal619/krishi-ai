"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Locale = "en" | "ne";

export const translations = {
  en: {
    brand: "HAMRO KRISHI SEWA",
    marketplace: "Marketplace",
    ai: "AI",
    weather: "Weather",
    blog: "Blog",
    contact: "Contact",
    login: "Login",
    register: "Register",
    cart: "Cart",
    profile: "Profile",
    language: "Language",
    searchPlaceholder: "Search maize, tomato, rice...",
    heroBadge: "BUILT FOR NEPAL'S FARMERS",
    heroTitle1: "Grow smarter.",
    heroTitle2: "Sell faster.",
    heroTitle3: "Earn better.",
    heroBody: "List your harvest, detect crop disease with AI, and get fair prices — all from one platform built for the field.",
    startSelling: "Start Selling",
    exploreMarketplace: "Explore Marketplace",
    search: "Search",
    direct: "Direct",
    farmerMarket: "Farmer Marketplace",
    live: "Live",
    marketPrices: "Market Prices",
    aiPowered: "AI Powered",
    cropDiagnosis: "Crop Diagnosis",
    verified: "Verified",
    qualityProduce: "Quality Produce",
  },
  ne: {
    brand: "हाम्रो कृषि सेवा",
    marketplace: "मार्केटप्लेस",
    ai: "एआई",
    weather: "मौसम",
    blog: "ब्लग",
    contact: "सम्पर्क",
    login: "लग इन",
    register: "दर्ता",
    cart: "कार्ट",
    profile: "प्रोफाइल",
    language: "भाषा",
    searchPlaceholder: "मकै, टमाटर, धान खोज्नुहोस्...",
    heroBadge: "नेपालका किसानका लागि",
    heroTitle1: "अझै राम्रोसँग",
    heroTitle2: "तेजै बेच्नुहोस्।",
    heroTitle3: "बेहतर कमाउनुहोस्।",
    heroBody: "तपाईंको उत्पादन सूचीबद्ध गर्नुहोस्, एआईले फसल रोग पत्ता लगाउन सहयोग गर्नुहोस्, र उचित मूल्य पाउनुहोस् — सबै एकै प्लेटफर्ममा।",
    startSelling: "बेच्न सुरु गर्नुहोस्",
    exploreMarketplace: "मार्केटप्लेस हेर्नुहोस्",
    search: "खोज्नुहोस्",
    direct: "प्रत्यक्ष",
    farmerMarket: "किसान मार्केटप्लेस",
    live: "लाइभ",
    marketPrices: "बजार मूल्य",
    aiPowered: "एआईमा आधारित",
    cropDiagnosis: "फसल निदान",
    verified: "पुनः प्रमाणित",
    qualityProduce: "गुणस्तरयुक्त उत्पादन",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

const LanguageContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (typeof translations)[Locale];
}>({
  locale: "en",
  setLocale: () => undefined,
  t: translations.en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("lang") as Locale | null;
    if (stored === "en" || stored === "ne") {
      setLocaleState(stored);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("lang", locale);
      document.documentElement.lang = locale === "ne" ? "ne" : "en";
    }
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale: (next: Locale) => setLocaleState(next),
      t: translations[locale],
    }),
    [locale],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageSelector() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-full border border-dark/10 bg-white/60 p-1 text-[10px] font-medium text-dark/70">
      {(["en", "ne"] as Locale[]).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLocale(option)}
          className={`rounded-full px-2.5 py-1 transition ${
            locale === option ? "bg-primary text-cream" : "hover:text-dark"
          }`}
          aria-label={`Switch language to ${option === "en" ? "English" : "Nepali"}`}
        >
          {option === "en" ? "EN" : "NP"}
        </button>
      ))}
    </div>
  );
}
