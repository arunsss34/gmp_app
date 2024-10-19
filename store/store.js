import { configureStore } from '@reduxjs/toolkit';
import  warpDetailsReducer from '../component/production/doff/warpSlice';
import LMListReducer from '../component/production/doff/LMListSlice';
import QRReducer from '../component/barcodescan/QrSlice';

export const store = configureStore({
  reducer: {
    warpDetails: warpDetailsReducer,
    LMList: LMListReducer,
    QRData: QRReducer
  },
});