'use client';

import React, { useState } from 'react';
import { Control, Controller, FieldValues } from 'react-hook-form';
import { Check, ChevronsUpDown, X } from 'lucide-react';

interface MultipleSelectProps {
  name: string;
  control?: Control<FieldValues>;
  options: string[];
  placeholder?: string;
  defaultValues?: string[];
  errors?: any;
}

export default function MultipleSelect({
  name,
  control,
  options,
  placeholder = 'Select options...',
  defaultValues = [],
}: MultipleSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  if (!control) {
    // Render a non-controlled version if control is not provided
    return (
      <div className="relative">
        <div
          className="flex flex-wrap gap-2 p-2 border rounded-md cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedOptions.length > 0 ? (
            selectedOptions.map((item) => (
              <span
                key={item}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center"
              >
                {item}
                <X
                  className="ml-1 h-4 w-4 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedOptions(
                      selectedOptions.filter((i) => i !== item),
                    );
                  }}
                />
              </span>
            ))
          ) : (
            <span className="text-[#5C5C5C]">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-auto h-4 w-4 text-gray-400" />
        </div>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
            {options.map((option) => (
              <div
                key={option}
                className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setSelectedOptions(
                    selectedOptions.includes(option)
                      ? selectedOptions.filter((item) => item !== option)
                      : [...selectedOptions, option],
                  );
                  setIsOpen(false);
                }}
              >
                <Check
                  className={`mr-2 h-4 w-4 ${
                    selectedOptions.includes(option)
                      ? 'text-black'
                      : 'text-transparent'
                  }`}
                />
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValues} // Use defaultValues directly
        render={({ field }) => (
          <div className="relative">
            <div
              className="flex flex-wrap gap-2 p-2 border rounded-md cursor-pointer relative bg-primary-light-gray"
              onClick={() => setIsOpen(!isOpen)}
            >
              {field.value?.length > 0 ? (
                field.value.map((item: string) => (
                  <span
                    key={item}
                    className="bg-blue-100 text-black px-2 py-1 rounded-md flex items-center capitalize"
                  >
                    {item}
                    <X
                      className="ml-1 h-4 w-4 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        field.onChange(
                          field.value.filter((i: string) => i !== item),
                        );
                      }}
                    />
                  </span>
                ))
              ) : (
                <span className="text-[#5C5C5C]">{placeholder}</span>
              )}
              <ChevronsUpDown className="ml-auto h-4 w-4 text-gray-400 absolute top-1/2 right-2 -translate-y-1/2" />
            </div>
            {isOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                {options.map((option) => (
                  <div
                    key={option}
                    className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 capitalize"
                    onClick={() => {
                      const newValue = field.value.includes(option)
                        ? field.value.filter((item: string) => item !== option)
                        : [...field.value, option];
                      field.onChange(newValue);
                      setIsOpen(false);
                    }}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        field.value.includes(option)
                          ? 'text-black'
                          : 'text-transparent'
                      }`}
                    />
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      />
    </>
  );
}
