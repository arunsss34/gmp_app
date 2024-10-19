import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface QrState {
  data: string | null;
}

const initialState: QrState = {
  data: null,
};

const qrSlice = createSlice({
  name: 'qr',
  initialState,
  reducers: {
    setQrData(state, action: PayloadAction<string | null>) {
      state.data = action.payload;
    },
  },
});

export const { setQrData } = qrSlice.actions;
export default qrSlice.reducer;
