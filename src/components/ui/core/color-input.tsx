'use client';

import { X, Palette, Pipette, Trash2 } from 'lucide-react';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

// ─── Data ────────────────────────────────────────────────────────────────────

const COLOR_MAP: Record<string, string> = {
  Red: '#ff0000',
  Crimson: '#dc143c',
  Tomato: '#ff6347',
  Coral: '#ff7f50',
  OrangeRed: '#ff4500',
  Orange: '#ffa500',
  Gold: '#ffd700',
  Yellow: '#ffff00',
  Amber: '#ffbf00',
  Scarlet: '#ff2400',
  Rust: '#b7410e',
  Burgundy: '#800020',
  Maroon: '#800000',
  Brown: '#a52a2a',
  Chocolate: '#d2691e',
  Sienna: '#a0522d',
  Peru: '#cd853f',
  Salmon: '#fa8072',
  Peach: '#ffcba4',
  Nude: '#e3bc9a',
  Blue: '#0000ff',
  Navy: '#000080',
  RoyalBlue: '#4169e1',
  DodgerBlue: '#1e90ff',
  DeepSkyBlue: '#00bfff',
  SkyBlue: '#87ceeb',
  CobaltBlue: '#0047ab',
  SteelBlue: '#4682b4',
  LightBlue: '#add8e6',
  Teal: '#008080',
  Cyan: '#00ffff',
  Turquoise: '#40e0d0',
  Aquamarine: '#7fffd4',
  Mint: '#98ff98',
  Jade: '#00a86b',
  Emerald: '#50c878',
  DarkGreen: '#006400',
  Green: '#008000',
  LimeGreen: '#32cd32',
  Lime: '#00ff00',
  Pink: '#ffc0cb',
  LightPink: '#ffb6c1',
  HotPink: '#ff69b4',
  Lavender: '#e6e6fa',
  Lilac: '#c8a2c8',
  Plum: '#dda0dd',
  Orchid: '#da70d6',
  Violet: '#ee82ee',
  Magenta: '#ff00ff',
  Fuchsia: '#ff00ff',
  DeepPink: '#ff1493',
  Thistle: '#d8bfd8',
  MistyRose: '#ffe4e1',
  Champagne: '#f7e7ce',
  Cream: '#fffdd0',
  Beige: '#f5f5dc',
  Ivory: '#fffff0',
  LightYellow: '#ffffe0',
  Khaki: '#f0e68c',
  Black: '#000000',
  Charcoal: '#36454f',
  DimGray: '#696969',
  Gray: '#808080',
  DarkGray: '#a9a9a9',
  SlateGray: '#708090',
  Silver: '#c0c0c0',
  LightGray: '#d3d3d3',
  Gainsboro: '#dcdcdc',
  WhiteSmoke: '#f5f5f5',
  White: '#ffffff',
  Taupe: '#483c32',
  Tan: '#d2b48c',
  Sand: '#c2b280',
  Indigo: '#4b0082',
  Purple: '#800080',
  BlueViolet: '#8a2be2',
  SlateBlue: '#6a5acd',
  MediumPurple: '#9370db',
  Olive: '#808000',
};

const CATEGORIES: Record<string, string[]> = {
  Warm: [
    'Red',
    'Crimson',
    'Tomato',
    'Coral',
    'OrangeRed',
    'Orange',
    'Gold',
    'Yellow',
    'Amber',
    'Scarlet',
    'Rust',
    'Burgundy',
    'Maroon',
    'Brown',
    'Chocolate',
    'Sienna',
    'Salmon',
    'Peach',
    'Nude',
    'Peru',
  ],
  Cool: [
    'Blue',
    'Navy',
    'RoyalBlue',
    'DodgerBlue',
    'DeepSkyBlue',
    'SkyBlue',
    'CobaltBlue',
    'SteelBlue',
    'LightBlue',
    'Teal',
    'Cyan',
    'Turquoise',
    'Aquamarine',
    'Mint',
    'Jade',
    'Emerald',
    'DarkGreen',
    'Green',
    'LimeGreen',
    'Lime',
  ],
  Pastel: [
    'Pink',
    'LightPink',
    'HotPink',
    'Lavender',
    'Lilac',
    'Plum',
    'Orchid',
    'Violet',
    'Magenta',
    'Fuchsia',
    'DeepPink',
    'Thistle',
    'MistyRose',
    'Champagne',
    'Cream',
    'Beige',
    'Ivory',
    'LightYellow',
    'Khaki',
  ],
  Neutral: [
    'Black',
    'Charcoal',
    'DimGray',
    'Gray',
    'DarkGray',
    'SlateGray',
    'Silver',
    'LightGray',
    'Gainsboro',
    'WhiteSmoke',
    'White',
    'Taupe',
    'Tan',
    'Sand',
    'Beige',
    'Nude',
    'Champagne',
    'Ivory',
    'Cream',
  ],
};

const QUICK_COLORS = [
  'Red',
  'Blue',
  'Green',
  'Pink',
  'Purple',
  'Orange',
  'Black',
  'White',
  'Gold',
  'Teal',
  'Brown',
  'Coral',
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const toHex = (name: string): string => {
  if (name.startsWith('#')) return name;
  if (COLOR_MAP[name]) return COLOR_MAP[name];
  if (typeof window === 'undefined') return '#888888';
  try {
    const c = document.createElement('canvas');
    c.width = c.height = 1;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = name;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
  } catch {
    return '#888888';
  }
};

const hexToColorName = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  let best = 'Gray',
    min = Infinity;
  for (const [name, h] of Object.entries(COLOR_MAP)) {
    const d =
      (r - parseInt(h.slice(1, 3), 16)) ** 2 +
      (g - parseInt(h.slice(3, 5), 16)) ** 2 +
      (b - parseInt(h.slice(5, 7), 16)) ** 2;
    if (d < min) {
      min = d;
      best = name;
    }
  }
  return best;
};

const normalizeColorName = (input: string): string => {
  const cleaned = input.trim().replace(/\s+/g, '').toLowerCase();
  const match = Object.keys(COLOR_MAP).find((k) => k.toLowerCase() === cleaned);
  return (
    match ??
    input.trim().charAt(0).toUpperCase() + input.trim().slice(1).toLowerCase()
  );
};

const isDuplicate = (color: string, list: string[]) =>
  list.some((c) => c.toLowerCase() === color.toLowerCase());

// ─── Component ───────────────────────────────────────────────────────────────

export const ColorInput = ({
  value = [],
  onChange,
}: {
  value?: string[];
  onChange: (val: string[]) => void;
}) => {
  const [inputValue, setInputValue] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Warm');

  const inputRef = useRef<HTMLInputElement>(null);
  const colorPickerRef = useRef<HTMLInputElement>(null);
  const pickerHexRef = useRef<string>('#ff0000');
  const pickerTimerRef = useRef<NodeJS.Timeout | null>(null); // ✅ fixed
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (pickerTimerRef.current) clearTimeout(pickerTimerRef.current);
    };
  }, []);

  const add = useCallback(
    (raw: string) => {
      if (!raw.trim()) return false;
      const name = normalizeColorName(raw);
      if (!name || isDuplicate(name, value)) return false;
      onChange([...value, name]);
      return true;
    },
    [value, onChange],
  );

  const remove = useCallback(
    (color: string) => {
      onChange(value.filter((c) => c !== color));
    },
    [value, onChange],
  );

  const toggleFromPanel = useCallback(
    (name: string) => {
      if (isDuplicate(name, value)) remove(name);
      else add(name);
    },
    [value, add, remove],
  );

  // Debounced — fires 300ms after user stops dragging
  const handlePickerChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      pickerHexRef.current = e.target.value;
      if (pickerTimerRef.current) clearTimeout(pickerTimerRef.current); // ✅ fixed
      pickerTimerRef.current = setTimeout(() => {
        // ✅ fixed
        const name = hexToColorName(pickerHexRef.current);
        if (!isDuplicate(name, value)) {
          onChange([...value, name]);
        }
        pickerTimerRef.current = null;
      }, 300);
    },
    [value, onChange],
  );

  const quickRemaining = QUICK_COLORS.filter((s) => !isDuplicate(s, value));

  return (
    <TooltipProvider delayDuration={400}>
      <div className="space-y-2" ref={wrapperRef}>
        {/* ── Input Field ── */}
        <div
          className="flex flex-wrap items-center gap-1.5 min-h-[48px] px-2.5 py-2 bg-[#f5f5f5] rounded-sm cursor-text transition-all focus-within:ring-2 focus-within:ring-gray-200"
          onClick={() => inputRef.current?.focus()}
        >
          {/* Chips */}
          {value.map((color) => (
            <span
              key={color}
              className="inline-flex items-center gap-1.5 pl-1.5 pr-1.5 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700 select-none"
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/10 flex-shrink-0"
                style={{ backgroundColor: toHex(color) }}
              />
              <span className="max-w-[72px] truncate">{color}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  remove(color);
                }}
                className="flex items-center justify-center w-4 h-4 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <X size={9} strokeWidth={2.5} />
              </button>
            </span>
          ))}

          {/* Text input */}
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (['Enter', ','].includes(e.key)) {
                e.preventDefault();
                if (add(inputValue)) setInputValue('');
              }
              if (e.key === 'Backspace' && !inputValue && value.length > 0) {
                remove(value[value.length - 1]);
              }
            }}
            onBlur={() => {
              if (inputValue.trim() && add(inputValue)) setInputValue('');
            }}
            placeholder={
              value.length === 0 ? 'Type a color name...' : 'Add more...'
            }
            className="border-none shadow-none focus-visible:ring-0 flex-1 min-w-[130px] h-7 p-0 text-sm bg-transparent placeholder:text-gray-400"
          />

          {/* Action buttons */}
          <div className="flex items-center gap-1 ml-auto flex-shrink-0">
            {/* Browse palette */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPanelOpen((o) => !o);
                  }}
                  className={cn(
                    'flex items-center justify-center w-7 h-7 rounded-lg border transition-all',
                    panelOpen
                      ? 'bg-gray-100 border-gray-300 text-gray-700'
                      : 'border-gray-200 text-gray-400 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-600',
                  )}
                >
                  <Palette size={13} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                Browse colors
              </TooltipContent>
            </Tooltip>

            {/* Color picker */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    colorPickerRef.current?.click();
                  }}
                  className="flex items-center justify-center w-7 h-7 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-600 transition-all"
                >
                  <Pipette size={13} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                Color picker
              </TooltipContent>
            </Tooltip>

            {/* Clear all */}
            {value.length > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange([]);
                    }}
                    className="flex items-center justify-center w-7 h-7 rounded-lg border border-gray-200 text-gray-400 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={12} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  Clear all
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Hidden native color input */}
          <input
            ref={colorPickerRef}
            type="color"
            className="sr-only"
            onChange={handlePickerChange}
          />
        </div>

        {/* ── Hint ── */}
        <p className="text-[11px] text-gray-400">
          Press{' '}
          <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px]">
            Enter
          </kbd>{' '}
          or{' '}
          <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px]">,</kbd>{' '}
          to add ·{' '}
          <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px]">
            Backspace
          </kbd>{' '}
          to remove last
        </p>

        {/* ── Quick suggestion chips ── */}
        {quickRemaining.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {quickRemaining.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => add(color)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-gray-200 bg-white text-[11px] text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50 transition-all"
              >
                <span
                  className="w-2 h-2 rounded-full border border-black/10 flex-shrink-0"
                  style={{ backgroundColor: toHex(color) }}
                />
                {color}
              </button>
            ))}
          </div>
        )}

        {/* ── Browse Panel ── */}
        {panelOpen && (
          <div
            ref={panelRef}
            className="border border-gray-200 rounded-xl p-3 bg-white space-y-3 shadow-sm"
          >
            {/* Category tabs */}
            <div className="flex gap-1.5 flex-wrap">
              {Object.keys(CATEGORIES).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs border transition-all',
                    activeTab === tab
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 bg-white',
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Swatches grid */}
            <div className="grid grid-cols-10 gap-1.5">
              {(CATEGORIES[activeTab] ?? []).map((name) => (
                <Tooltip key={name}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => toggleFromPanel(name)}
                      style={{ backgroundColor: toHex(name) }}
                      className={cn(
                        'w-full aspect-square rounded-md border transition-all hover:scale-110',
                        isDuplicate(name, value)
                          ? 'border-2 border-gray-800 ring-2 ring-white ring-offset-1 scale-105'
                          : 'border-black/10 hover:border-black/20',
                      )}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    {name}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
