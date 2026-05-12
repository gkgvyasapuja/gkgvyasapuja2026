"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Loader2, Search, X } from "lucide-react";

export type ComboboxItem = { id: string; name: string };

interface AsyncSearchComboboxProps {
  id: string;
  label: string;
  placeholder: string;
  search: (query: string) => Promise<ComboboxItem[]>;
  value: ComboboxItem | null;
  onChange: (value: ComboboxItem | null) => void;
  disabled?: boolean;
  emptyMessage?: string;
}

export function AsyncSearchCombobox({
  id,
  label,
  placeholder,
  search,
  value,
  onChange,
  disabled,
  emptyMessage = "No matches",
}: AsyncSearchComboboxProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value?.name ?? "");
  const [results, setResults] = useState<ComboboxItem[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value?.name ?? "");
  }, [value?.id, value?.name]);

  useEffect(() => {
    function handleDocMouseDown(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleDocMouseDown);
    return () => document.removeEventListener("mousedown", handleDocMouseDown);
  }, []);

  const runSearch = useCallback(
    async (q: string) => {
      setLoading(true);
      try {
        const items = await search(q.trim());
        setResults(items);
      } finally {
        setLoading(false);
      }
    },
    [search],
  );

  useEffect(() => {
    if (!open) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void runSearch(inputValue);
    }, 320);
    return () => clearTimeout(debounceRef.current);
  }, [inputValue, open, runSearch]);

  function handleInputChange(next: string) {
    setInputValue(next);
    setOpen(true);
    if (value) {
      onChange(null);
    }
  }

  function handleClear() {
    onChange(null);
    setInputValue("");
    setResults([]);
    setOpen(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  const hasValue = Boolean(value);
  const showClear = (hasValue || inputValue.length > 0) && !disabled;

  return (
    <div ref={containerRef} className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <div className="relative">
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400",
            disabled && "opacity-50",
          )}
        >
          <Search className="h-4 w-4" aria-hidden />
        </div>

        <Input
          ref={inputRef}
          id={id}
          placeholder={placeholder}
          value={inputValue}
          disabled={disabled}
          autoComplete="off"
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
            } else if (e.key === "ArrowDown" && !open) {
              setOpen(true);
            }
          }}
          aria-expanded={open}
          aria-controls={`${id}-listbox`}
          role="combobox"
          className={cn(
            "h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-9 text-sm shadow-sm transition-colors",
            "placeholder:text-gray-400",
            "hover:border-gray-300",
            "focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/20",
            hasValue && "border-indigo-200 bg-indigo-50/40",
            disabled && "bg-gray-50 text-gray-400",
          )}
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          {showClear ? (
            <button
              type="button"
              onClick={handleClear}
              tabIndex={-1}
              className="flex h-6 w-6 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
              aria-label="Clear"
              title="Clear"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          ) : (
            <ChevronDown
              className={cn(
                "h-4 w-4 text-gray-400 transition-transform",
                disabled && "opacity-50",
                open && "rotate-180",
              )}
              aria-hidden
            />
          )}
        </div>

        {open && !disabled && (
          <ul
            id={`${id}-listbox`}
            role="listbox"
            className={cn(
              "absolute left-0 right-0 top-full z-50 mt-1.5 max-h-60 overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-black/5",
            )}
          >
            {loading ? (
              <li className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                Searching…
              </li>
            ) : results.length === 0 ? (
              <li className="px-3 py-2.5 text-sm text-muted-foreground">
                {emptyMessage}
              </li>
            ) : (
              results.map((item) => {
                const selected = value?.id === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      className={cn(
                        "flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors",
                        selected
                          ? "bg-indigo-50 text-indigo-700 font-medium"
                          : "text-gray-900 hover:bg-gray-50",
                      )}
                      onClick={() => {
                        onChange(item);
                        setInputValue(item.name);
                        setOpen(false);
                      }}
                    >
                      <span className="truncate">{item.name}</span>
                      {selected && (
                        <Check
                          className="h-4 w-4 text-indigo-600 shrink-0"
                          aria-hidden
                        />
                      )}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
