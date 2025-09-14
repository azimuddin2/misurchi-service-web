// redux/features/checkout/checkoutSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Product {
  productName: string;
  image: string;
  product: string;
  quantity: number;
  price: number;
  discount: number;
}

interface CheckoutState {
  products: Product[];
  vendor?: string;
  totalPrice: number;
}

const initialState: CheckoutState = {
  products: [],
  vendor: undefined,
  totalPrice: 0,
};

export const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setCheckoutData: (state, action: PayloadAction<CheckoutState>) => {
      state.products = action.payload.products;
      state.vendor = action.payload.vendor;
      state.totalPrice = action.payload.totalPrice;
    },
    clearCheckoutData: (state) => {
      state.products = [];
      state.vendor = undefined;
      state.totalPrice = 0;
    },
  },
});

export const { setCheckoutData, clearCheckoutData } = checkoutSlice.actions;

export default checkoutSlice.reducer;
