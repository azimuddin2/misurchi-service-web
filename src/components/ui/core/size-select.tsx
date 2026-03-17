'use client';
import * as React from 'react';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox';

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

interface Props {
  value?: string[];
  onChange?: (values: string[]) => void;
}

const SizeSelect = ({ value, onChange }: Props) => {
  const anchor = useComboboxAnchor();

  return (
    <Combobox
      multiple
      autoHighlight
      items={SIZE_OPTIONS}
      value={value}
      onValueChange={onChange}
    >
      <ComboboxChips
        ref={anchor}
        className="w-full bg-[#f5f5f5] border-none rounded-sm min-h-[48px] px-3"
      >
        <ComboboxValue>
          {(values) => (
            <React.Fragment>
              {values.map((v: string) => (
                <ComboboxChip
                  key={v}
                  className="flex items-center gap-2 px-2 py-1 rounded-sm text-xs bg-white border-gray-300 text-gray-700 shadow-sm"
                >
                  {v}
                </ComboboxChip>
              ))}
              <ComboboxChipsInput placeholder="Select size..." />
            </React.Fragment>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

export default SizeSelect;
