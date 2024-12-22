import { combineReducers } from '@reduxjs/toolkit';
import {authReducer} from './authSlice.js';
import orderReducers from './orderSlice.js';
import menuReducers from './menuSlice.js';
import settingReducers from './settingSlice.js';
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const authPersistConfig = {
  key: 'merchant-auth',
  storage,
  whitelist: ['token', "merchant"]
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const merchantReducer = combineReducers({
  auth: persistedAuthReducer,
  orders: orderReducers,
  menu: menuReducers,
  setting: settingReducers
});

export default merchantReducer;