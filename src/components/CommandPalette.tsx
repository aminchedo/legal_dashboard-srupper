import React, { useEffect, useMemo, useRef, useState } from 'react';

export interface CommandItem {
    id: string;
    label: string;
    hint?: string;
    group?: string;
    icon?: React.ReactNode;
    keywords?: string[];
    action: () => void;
}

interface CommandPaletteProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    items: CommandItem[];
    placeholder?: string;
}

export default function CommandPalette({ open, onOpenChange, items, placeholder }: CommandPaletteProps) {
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const listRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 0);
        } else {
            setQuery('');
            setActiveIndex(0);
        }
    }, [open]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (!open) return;
            if (e.key === 'Escape') {
                e.preventDefault();
                onOpenChange(false);
            }
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveIndex((prev) => Math.min(prev + 1, filteredItems.length - 1));
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveIndex((prev) => Math.max(prev - 1, 0));
            }
            if (e.key === 'Enter') {
                e.preventDefault();
                const item = filteredItems[activeIndex];
                if (item) {
                    item.action();
                    onOpenChange(false);
                }
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [open, activeIndex]);

    const filteredItems = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return items;
        return items.filter((it) => {
            const hay = [it.label, it.hint, ...(it.keywords || [])].join(' ').toLowerCase();
            return hay.includes(q);
        });
    }, [items, query]);

    useEffect(() => {
        if (!listRef.current) return;
        const active = listRef.current.querySelector('[data-active="true"]') as HTMLDivElement | null;
        if (active) {
            active.scrollIntoView({ block: 'nearest' });
        }
    }, [activeIndex, filteredItems.length]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100]" aria-modal="true" role="dialog">
            <div className="absolute inset-0 bg-black/40" onClick={() => onOpenChange(false)} />
            <div className="relative mx-auto mt-24 w-full max-w-2xl px-4">
                <div className="rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3 dark:border-slate-800">
                        <input
                            ref={inputRef}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={placeholder || 'Type a command or search...'}
                            className="w-full bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none dark:text-slate-100"
                            aria-label="Command search"
                        />
                        <kbd className="hidden md:inline-flex items-center gap-1 rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            <span className="font-sans">Ctrl</span> K
                        </kbd>
                    </div>

                    <div ref={listRef} className="max-h-80 overflow-y-auto p-2">
                        {filteredItems.length === 0 ? (
                            <div className="p-6 text-center text-sm text-gray-500 dark:text-slate-400">No results</div>
                        ) : (
                            <div className="space-y-1">
                                {filteredItems.map((item, idx) => (
                                    <div
                                        key={item.id}
                                        data-active={idx === activeIndex}
                                        onMouseEnter={() => setActiveIndex(idx)}
                                        onClick={() => {
                                            item.action();
                                            onOpenChange(false);
                                        }}
                                        className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${idx === activeIndex
                                                ? 'bg-blue-50 text-blue-900 dark:bg-blue-900/30 dark:text-blue-100'
                                                : 'text-gray-700 hover:bg-gray-50 dark:text-slate-200 dark:hover:bg-slate-800'
                                            }`}
                                    >
                                        {item.icon && <span className="shrink-0">{item.icon}</span>}
                                        <div className="min-w-0">
                                            <div className="truncate font-medium">{item.label}</div>
                                            {item.hint && (
                                                <div className="truncate text-xs text-gray-500 dark:text-slate-400">{item.hint}</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}


