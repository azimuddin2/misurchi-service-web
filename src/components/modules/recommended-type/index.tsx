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
import { useGetAllRecommendedTypeQuery } from '@/redux/features/recommendedType/recommendedTypeApi';

interface Props {
  value?: string[];
  onChange?: (values: string[]) => void;
}

const RecommendedType = ({ value, onChange }: Props) => {
  const anchor = useComboboxAnchor();

  const { data: recommendedTypes } = useGetAllRecommendedTypeQuery({});

  const items: string[] =
    recommendedTypes?.data?.map((item: any) => item.name) ?? [];

  return (
    <Combobox
      multiple
      autoHighlight
      items={items}
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
              {values.map((value: string) => (
                <ComboboxChip
                  key={value}
                  className="flex items-center gap-2 px-2 py-1 rounded-sm text-xs bg-white border-gray-300 text-gray-700 shadow-sm"
                >
                  {value}
                </ComboboxChip>
              ))}
              <ComboboxChipsInput placeholder="Select recommended type..." />
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

export default RecommendedType;
