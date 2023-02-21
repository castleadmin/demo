import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CheckoutFormData } from './checkout';
import { environment } from './environments/environment';

export interface CheckoutState {
  checkoutFormData?: CheckoutFormData;
}

export const checkoutStateKey = 'checkoutState';

let persistedState;

if (!environment.serverSide) {
  persistedState = localStorage.getItem(checkoutStateKey);
}

const initialState: CheckoutState = persistedState
  ? JSON.parse(persistedState)
  : {};

export const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    addCheckoutFormData: (state, action: PayloadAction<CheckoutFormData>) => {
      state.checkoutFormData = action.payload;
    },
    removeCheckoutFormData: (state) => {
      delete state.checkoutFormData;
    },
  },
});

export const { addCheckoutFormData, removeCheckoutFormData } =
  checkoutSlice.actions;

export default checkoutSlice.reducer;
