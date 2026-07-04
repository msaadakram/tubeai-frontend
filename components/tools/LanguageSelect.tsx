"use client";

import React, { useEffect, useRef, useState } from "react";
import { Globe, Check, ChevronDown, Search } from "lucide-react";

export type LanguageOption = {
  code: string;
  name: string;
  native: string;
  flag: string;
};

export const LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", native: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", native: "Español", flag: "🇪🇸" },
  { code: "hi", name: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
  { code: "pt", name: "Portuguese", native: "Português", flag: "🇧🇷" },
  { code: "fr", name: "French", native: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", native: "Deutsch", flag: "🇩🇪" },
  { code: "ar", name: "Arabic", native: "العربية", flag: "🇸🇦" },
  { code: "ja", name: "Japanese", native: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "Korean", native: "한국어", flag: "🇰🇷" },
  { code: "zh", name: "Chinese", native: "中文", flag: "🇨🇳" },
  { code: "ru", name: "Russian", native: "Русский", flag: "🇷🇺" },
  { code: "id", name: "Indonesian", native: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "tr", name: "Turkish", native: "Türkçe", flag: "🇹🇷" },
  { code: "it", name: "Italian", native: "Italiano", flag: "🇮🇹" },
  { code: "nl", name: "Dutch", native: "Nederlands", flag: "🇳🇱" },
  { code: "pl", name: "Polish", native: "Polski", flag: "🇵🇱" },
  { code: "vi", name: "Vietnamese", native: "Tiếng Việt", flag: "🇻🇳" },
  { code: "th", name: "Thai", native: "ไทย", flag: "🇹🇭" },
  { code: "bn", name: "Bengali", native: "বাংলা", flag: "🇧🇩" },
  { code: "ur", name: "Urdu", native: "اردو", flag: "🇵🇰" },
  { code: "fa", name: "Persian", native: "فارسی", flag: "🇮🇷" },
  { code: "uk", name: "Ukrainian", native: "Українська", flag: "🇺🇦" },
  { code: "sv", name: "Swedish", native: "Svenska", flag: "🇸🇪" },
  { code: "fil", name: "Filipino", native: "Filipino", flag: "🇵🇭" },
];

export function getLanguage(code: string): LanguageOption {
  return LANGUAGES.find((l) => l.code === code) || LANGUAGES[0];
}

type Props = {
  value: string;
  onChange: (code: string) => void;
  label?: string;
  compact?: boolean;
};

export function LanguageSelect({ value, onChange, label = "Output Language", compact = false }: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const selected = getLanguage(value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = LANGUAGES.filter(
    (l) => l.name.toLowerCase().includes(q.toLowerCase()) || l.native.toLowerCase().includes(q.toLowerCase()) || l.code.includes(q.toLowerCase())
  );

  return (
    <div ref={ref} className="relative">
      {!compact && (
        <label className="block text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-red-600" />
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-white border-2 border-black rounded-lg font-bold text-sm hover:bg-neutral-50 transition-colors ${open ? "shadow-[3px_3px_0px_0px_rgba(220,38,38,1)]" : ""}`}
      >
        <span className="flex items-center gap-2 min-w-0">
          <span className="text-lg leading-none">{selected.flag}</span>
          <span className="font-black truncate">{selected.name}</span>
          <span className="text-[11px] text-neutral-500 font-bold truncate hidden sm:inline">· {selected.native}</span>
        </span>
        <ChevronDown className={`w-4 h-4 text-neutral-500 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-full bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="px-3 py-2 border-b-2 border-black bg-neutral-50 flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-neutral-500" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search 24 languages..."
              className="flex-1 outline-none text-xs font-bold bg-transparent"
            />
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <div className="px-3 py-4 text-center text-xs font-bold text-neutral-500">No language matches "{q}"</div>
            )}
            {filtered.map((l) => {
              const active = l.code === value;
              return (
                <button
                  key={l.code}
                  onClick={() => {
                    onChange(l.code);
                    setOpen(false);
                    setQ("");
                  }}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-red-50 transition-colors ${active ? "bg-red-600 text-white hover:bg-red-600" : ""}`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base leading-none">{l.flag}</span>
                    <span className="font-black truncate">{l.name}</span>
                    <span className={`text-[11px] font-bold truncate ${active ? "text-red-100" : "text-neutral-500"}`}>· {l.native}</span>
                  </span>
                  {active && <Check className="w-4 h-4 shrink-0" />}
                </button>
              );
            })}
          </div>
          <div className="px-3 py-1.5 border-t-2 border-black bg-neutral-50 text-[10px] font-black uppercase tracking-wider text-neutral-500">
            {LANGUAGES.length} languages supported
          </div>
        </div>
      )}
    </div>
  );
}
