'use client';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppSelector } from '@/redux/hooks';
import { setLanguage } from '@/redux/features/language/languageSlice';

const languages = [{ code: 'en', name: 'English', flag: '🇺🇸' }];

export default function LanguageSettings() {
  const dispatch = useDispatch();
  const lang = useAppSelector((state) => state.language.lang);
  const { t } = useTranslation();

  const handleChange = (value: string) => {
    dispatch(setLanguage(value));
  };

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold py-2">Language Settings</h2>
      <div className="p-4 rounded-lg shadow-sm bg-white flex justify-between items-center">
        <h2 className="font-medium mb-3">Choose Your Language</h2>
        <Select value={lang} onValueChange={handleChange}>
          <SelectTrigger className="h-12 rounded px-4 border-none shadow-sm">
            <SelectValue placeholder="Choose Your Language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lng) => (
              <SelectItem key={lng.code} value={lng.code}>
                <span className="flex items-center gap-2">
                  <span className="text-lg">{lng.flag}</span>
                  <span>{lng.name}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
