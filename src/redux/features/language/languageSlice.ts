import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LanguageState {
  lang: 'en' | 'bn';
}

const initialState: LanguageState = { lang: 'en' };

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<'en' | 'bn'>) {
      state.lang = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
