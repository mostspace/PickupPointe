import { combineReducers, configureStore } from '@reduxjs/toolkit';
import orderReducers from './orderSlice.js';
import locationReducer from './locationSlice.js';
import searchReducer from './searchSlice.js';

const shopperReducer = combineReducers({
  orders: orderReducers,
  locations: locationReducer,
  search: searchReducer,
});

export default shopperReducer;