import { combineReducers, configureStore } from '@reduxjs/toolkit';
import orderReducers from './orderSlice.js';
import locationSlice from './locationSlice.js';
import dashboardSlice from './dashboardSlice.js';
import searchSlice from './searchSlice.js';

const vendorReducer = combineReducers({
  orders: orderReducers,
  locations: locationSlice,
  dashboard: dashboardSlice,
  search: searchSlice,
});

export default vendorReducer;