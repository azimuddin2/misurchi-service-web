import { X } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const ColorInput = ({
  value = [],
  onChange,
}: {
  value?: string[];
  onChange: (val: string[]) => void;
}) => {
  const [inputValue, setInputValue] = useState('');
  const [pickerValue, setPickerValue] = useState('#000000');

  const normalize = (color: string) => color.trim().toLowerCase();

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
    <div className="bg-[#f5f5f5] rounded-sm p-3 flex flex-wrap gap-2 min-h-[52px]">
      {/* Existing colors as chips */}
      {value.map((color) => (
        <div
          key={color}
          className="flex items-center gap-2 px-3 py-1 rounded-md shadow border bg-white hover:shadow-md transition"
        >
          {/* Swatch */}
          <span
            className="w-5 h-5 rounded-full border"
            style={{ backgroundColor: color }}
          />
          <span className="text-sm">{color}</span>
          <X
            size={14}
            className="cursor-pointer text-red-500 hover:text-red-700"
            onClick={() => removeColor(color)}
          />
        </div>
      ))}

      {/* Text input for typing colors */}
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (['Enter', ',', ' '].includes(e.key)) {
            e.preventDefault();
            addColor(inputValue);
          }
        }}
        placeholder="Type color & press Enter"
        className="border-none bg-transparent focus:ring-0 flex-1 min-w-[120px]"
      />

      {/* Color picker */}
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={pickerValue}
          onChange={(e) => setPickerValue(e.target.value)}
          className="w-10 h-10 border rounded cursor-pointer"
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => addColor(pickerValue)}
        >
          Add
        </Button>
      </div>
    </div>
  );
};
