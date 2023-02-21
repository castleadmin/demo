import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import cartReducer, { cartStateKey } from './cart.state';
import checkoutReducer, { checkoutStateKey } from './checkout.state';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    checkout: checkoutReducer,
  },
});

store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem(cartStateKey, JSON.stringify(state.cart));
  localStorage.setItem(checkoutStateKey, JSON.stringify(state.checkout));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
