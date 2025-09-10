import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { TProduct } from '@/types/product.type';

interface CartItem extends TProduct {
  cartQuantity: number; // ✅ clearer than reusing product.quantity
}

interface CartState {
  items: CartItem[];
  total: number;
}

const initialState: CartState = {
  items: [],
  total: 0,
};

const calculateTotal = (items: CartItem[]) =>
  items.reduce((acc, item) => {
    const price = item.discountPrice ?? item.price; // ✅ prefer discount
    return acc + price * item.cartQuantity;
  }, 0);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<TProduct>) => {
      const existingItem = state.items.find(
        (item) => item._id === action.payload._id,
      );

      if (existingItem) {
        existingItem.cartQuantity += 1;
      } else {
        state.items.push({ ...action.payload, cartQuantity: 1 });
      }

      state.total = calculateTotal(state.items);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; cartQuantity: number }>,
    ) => {
      const item = state.items.find((item) => item._id === action.payload.id);
      if (item) {
        item.cartQuantity = action.payload.cartQuantity;
      }
      state.total = calculateTotal(state.items);
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      state.total = calculateTotal(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } =
  cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) => state.cart.total;

export default cartSlice.reducer;
