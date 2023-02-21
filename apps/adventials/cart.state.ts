import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { environment } from './environments/environment';
import { CartItem, cartItemMaxQuantity } from './item';

export interface CartState {
  cartItems: CartItem[];
}

export const cartStateKey = 'cartState';

let persistedState;

if (!environment.serverSide) {
  persistedState = localStorage.getItem(cartStateKey);
}

const initialState: CartState = persistedState
  ? JSON.parse(persistedState)
  : { cartItems: [] };

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const itemInCart = state.cartItems.find(
        (cartItem) => cartItem.item._id === action.payload.item._id
      );

      if (itemInCart) {
        itemInCart.quantity = Math.min(
          cartItemMaxQuantity,
          itemInCart.quantity + action.payload.quantity
        );
      } else {
        state.cartItems.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<CartItem>) => {
      const itemInCartIndex = state.cartItems.findIndex(
        (cartItem) => cartItem.item._id === action.payload.item._id
      );

      if (itemInCartIndex === -1) {
        throw new Error(
          `Couldn't find item with id ${action.payload.item._id} in cart.`
        );
      }

      state.cartItems.splice(itemInCartIndex, 1);
    },
    removeAllFromCart: (state) => {
      state.cartItems = [];
    },
    changeQuantity: (state, action: PayloadAction<CartItem>) => {
      if (action.payload.quantity > cartItemMaxQuantity) {
        throw new Error(
          `Couldn't change quantity to ${action.payload.quantity}. The maximal quantity is ${cartItemMaxQuantity}.`
        );
      }

      const itemInCart = state.cartItems.find(
        (cartItem) => cartItem.item._id === action.payload.item._id
      );

      if (!itemInCart) {
        throw new Error(
          `Couldn't find item with id ${action.payload.item._id} in cart.`
        );
      }

      itemInCart.quantity = action.payload.quantity;
    },
  },
});

export const { addToCart, removeFromCart, removeAllFromCart, changeQuantity } =
  cartSlice.actions;

export default cartSlice.reducer;
