import { createLogger } from "redux-logger";
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import roleReducer from 'src/reducers/roleSlice';
import userReducer from 'src/reducers/userSlice';
import itemReducer from "src/reducers/itemSlice";
import chatsReducer from "src/reducers/chatSlice";
import itemCategoryReducer from "src/reducers/itemCategorySlice";
import shopCategoryReducer from "src/reducers/shopCategorySlice";
import shopReducer from "src/reducers/shopSlice";
import locationReducer from "src/reducers/locationSlice";
import metricReducer from "src/reducers/metricSlice";
import marketReducer from "src/reducers/marketSlice";
import cartReducer from "src/reducers/cartSlice";
import orderReducer from "src/reducers/orderSlice";
import modifierReducer from "src/reducers/modifierSlice";
import reviewReducer from "src/reducers/reviewSlice";
import { authReducer } from "src/reducers/authSlice";
import shopperReducer from "src/reducers/shopper";
import vendorReducer from "src/reducers/vendor";
import merchantReducer from "src/reducers/merchant";
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from "redux-persist";

const middlewares = [];

if (process.env.NODE_ENV === 'development') {
  const logger = createLogger({ collapsed: (getState, action, logEntry) => !logEntry.error });
  middlewares.push(logger);
}

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token', 'type', 'user']
}
const chatPersistConfig = {
  key: 'chat',
  storage,
  whitelist: ['notifications']
}
const cartPersistConfig = {
  key: 'cart',
  storage,
}
const marketPersistConfig = {
  key: 'market',
  storage,
}

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedChatsReducer = persistReducer(chatPersistConfig, chatsReducer);
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer)
const persistedMarketReducer = persistReducer(marketPersistConfig, marketReducer)

const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  shopper: shopperReducer,
  vendor: vendorReducer,
  merchant: merchantReducer,
  chats: persistedChatsReducer,
  cart: persistedCartReducer,
  role: roleReducer,
  user: userReducer,
  items: itemReducer,
  shops: shopReducer,
  itemCategories: itemCategoryReducer,
  shopCategories: shopCategoryReducer,
  locations: locationReducer,
  metrics: metricReducer,
  market: persistedMarketReducer,
  order: orderReducer,
  modifiers: modifierReducer,
  reviews: reviewReducer,
})

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(middlewares),
  devTools: process.env.NODE_ENV === 'development',
});

export default store;
export const persistor = persistStore(store);