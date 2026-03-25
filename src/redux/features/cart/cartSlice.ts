import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { TProduct } from '@/types/product.type';

export interface CartItem extends TProduct {
  cartQuantity: number;
  selectedSize?: string | null;
  selectedColor?: string | null;
}

interface CartState {
  items: CartItem[];
  total: number;
}

const initialState: CartState = {
  items: [],
  total: 0,
};

// ✅ price calculation with discount
const calculateTotal = (items: CartItem[]) =>
  items.reduce((acc, item) => {
    const price = Number(item.price || 0);
    const discountPercent = Number(
      (item.discountPrice || '0').replace('%', ''),
    );

    const finalPrice = price - (price * discountPercent) / 100;

    return acc + finalPrice * item.cartQuantity;
  }, 0);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // ✅ add to cart with size & color
    addToCart: (
      state,
      action: PayloadAction<{
        product: TProduct;
        size?: string | null;
        color?: string | null;
      }>,
    ) => {
      const { product, size, color } = action.payload;

      const existingItem = state.items.find(
        (item) =>
          item._id === product._id &&
          item.selectedSize === size &&
          item.selectedColor === color,
      );

      if (existingItem) {
        existingItem.cartQuantity += 1;
      } else {
        state.items.push({
          ...product,
          selectedSize: size,
          selectedColor: color,
          cartQuantity: 1,
        });
      }

      state.total = calculateTotal(state.items);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{
        id: string;
        size?: string | null;
        color?: string | null;
        cartQuantity: number;
      }>,
    ) => {
      const item = state.items.find(
        (item) =>
          item._id === action.payload.id &&
          item.selectedSize === action.payload.size &&
          item.selectedColor === action.payload.color,
      );

      if (item) {
        item.cartQuantity = action.payload.cartQuantity;
      }

      state.total = calculateTotal(state.items);
    },

    updateOptions: (
      state,
      action: PayloadAction<{
        id: string;
        oldSize?: string | null;
        oldColor?: string | null;
        newSize?: string | null;
        newColor?: string | null;
      }>,
    ) => {
      const item = state.items.find(
        (item) =>
          item._id === action.payload.id &&
          item.selectedSize === action.payload.oldSize &&
          item.selectedColor === action.payload.oldColor,
      );

      if (item) {
        item.selectedSize = action.payload.newSize ?? item.selectedSize;
        item.selectedColor = action.payload.newColor ?? item.selectedColor;
      }

      state.total = calculateTotal(state.items);
    },

    removeFromCart: (
      state,
      action: PayloadAction<{
        id: string;
        size?: string | null;
        color?: string | null;
      }>,
    ) => {
      state.items = state.items.filter(
        (item) =>
          !(
            item._id === action.payload.id &&
            item.selectedSize === action.payload.size &&
            item.selectedColor === action.payload.color
          ),
      );

      state.total = calculateTotal(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});

export const {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  updateOptions,
} = cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) => state.cart.total;

export default cartSlice.reducer;
