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
  }

  return (
    <div ref={containerRef} className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div className="relative flex gap-1">
        <Input
          id={id}
          placeholder={placeholder}
          value={inputValue}
          disabled={disabled}
          autoComplete="off"
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setOpen(true)}
          className="flex-1"
        />
        {(value || inputValue.length > 0) && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 rounded-md border border-input bg-background px-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Clear"
          >
            ×
          </button>
        )}
        {open && !disabled && (
          <ul
            className={cn(
              "absolute left-0 right-0 top-full z-50 mt-1 max-h-52 overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-md",
            )}
          >
            {loading ? (
              <li className="px-3 py-2 text-sm text-muted-foreground">
                Searching…
              </li>
            ) : results.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted-foreground">
                {emptyMessage}
              </li>
            ) : (
              results.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className="w-full px-3 py-2 text-left text-sm text-gray-900 hover:bg-gray-100"
                    onClick={() => {
                      onChange(item);
                      setInputValue(item.name);
                      setOpen(false);
                    }}
                  >
                    {item.name}
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
