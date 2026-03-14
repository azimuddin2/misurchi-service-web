'use client';

import { X } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

// Dynamic hex converter
const toHex = (colorName: string): string => {
  if (typeof window === 'undefined') return '#888888';
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '#888888';
  ctx.fillStyle = colorName.toLowerCase();
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
};

export const ColorInput = ({
  value = [],
  onChange,
}: {
  value?: string[];
  onChange: (val: string[]) => void;
}) => {
  const [inputValue, setInputValue] = useState('');

  const normalize = (color: string) =>
    color.trim().charAt(0).toUpperCase() + color.trim().slice(1).toLowerCase();

  const addColor = (color: string) => {
    const normalized = normalize(color);
    if (normalized && !value.includes(normalized)) {
      onChange([...value, normalized]);
    }
    setInputValue('');
  };

  const removeColor = (color: string) => {
    onChange(value.filter((c) => c !== color));
  };

  return (
    <div className="border rounded-sm bg-[#f5f5f5] p-3 flex flex-wrap gap-2 min-h-[42px] focus-within:ring-2 focus-within:ring-ring transition border-none">
      {value.map((color) => (
        <span
          key={color}
          className="flex items-center bg-white gap-1.5 px-2 py-0.5 rounded-full text-sm font-medium  border"
        >
          {/* ← Dynamic color dot */}
          <span
            className="w-3.5 h-3.5 rounded-full border border-gray-300"
            style={{ backgroundColor: toHex(color) }}
          />
          {color}
          <X
            size={12}
            className="cursor-pointer opacity-50 hover:opacity-100 text-red-600 transition"
            onClick={() => removeColor(color)}
          />
        </span>
      ))}

      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (['Enter', ','].includes(e.key)) {
            e.preventDefault();
            addColor(inputValue);
          }
        }}
        onBlur={() => {
          if (inputValue) addColor(inputValue);
        }}
        placeholder={
          value.length === 0
            ? 'Type Color Name & Press Enter...'
            : 'Add more...'
        }
        className="border-none shadow-none focus-visible:ring-0 flex-1 min-w-[140px] h-7 p-0 text-sm"
      />
    </div>
  );
};
