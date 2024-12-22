import {createSlice} from "@reduxjs/toolkit";
import _ from 'lodash';

const initialState = {};

const ensureVendorState = (state, vendor) => {
	if (!state[vendor]) {
		state[vendor] = {items: [], total: 0};
	}
};

const isSameItem = (prev = [], next = []) => {
	if (prev.length !== next.length) return false;
	if (_.difference(prev, next).length === 0 && _.difference(next, prev).length === 0) return true;
	return false;
}

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		addItemToCart: (state, action) => {
			const {vendor, product, selectedItems, modifierPrices, quantity, selectedVariant} = action.payload;
			ensureVendorState(state, vendor);
			const existingItem = state[vendor].items.find(item =>
				item._id === product._id &&
				isSameItem(item.selectedItems, selectedItems) &&
				item.variant === (selectedVariant || "")
			);
			if (existingItem) {
				existingItem.quantity += quantity || 1;
			} else {
				state[vendor].items.push({
					...product,
					quantity: quantity || 1,
					selectedItems: selectedItems || [],
					modifierPrices: modifierPrices || [],
					variant: selectedVariant || ""
				});
			}
			state[vendor].total = state[vendor].items.reduce((sum, item) => sum + item.defaultPrice * item.quantity, 0);
		},
		
		changeItemCount: (state, action) => {
			const {vendor, itemId, selectedItems, type, available, variant} = action.payload;
			ensureVendorState(state, vendor);
			const existingItem = state[vendor].items.find(item =>
				item._id === itemId &&
				isSameItem(item.selectedItems, selectedItems) &&
				item.variant === variant
			);
			if (existingItem) {
				if (type) {
					existingItem.quantity = existingItem.quantity + 1 > available ? available : existingItem.quantity + 1;
				} else {
					existingItem.quantity = existingItem.quantity - 1 < 0 ? 0 : existingItem.quantity - 1;
				}
				state[vendor].items = state[vendor].items.filter(item => item.quantity !== 0);
				state[vendor].total = state[vendor].items.reduce((sum, item) => sum + item.defaultPrice * item.quantity, 0);
			}
		},
		addToCart: (state, action) => {
			const {vendor, product} = action.payload;
			ensureVendorState(state, vendor);
			const existingItem = state[vendor].items.find(item => item._id === product._id);
			if (existingItem) {
				existingItem.quantity += 1;
			} else {
				state[vendor].items.push({...product, quantity: 1});
			}
			state[vendor].total = state[vendor].items.reduce((sum, item) => sum + item.defaultPrice * item.quantity, 0);
		},
		decreaseCount: (state, action) => {
			const {vendor, itemId} = action.payload;
			ensureVendorState(state, vendor);
			state[vendor].items = state[vendor].items.map(item => item._id === itemId ? {
				...item,
				quantity: item.quantity - 1
			} : item);
			state[vendor].items = state[vendor].items.filter(item => item.quantity !== 0);
			state[vendor].total = state[vendor].items.reduce((sum, item) => sum + item.defaultPrice * item.quantity, 0)
		},
		removeItemFromCart: (state, action) => {
			const {vendor, itemId, selectedItems, variant} = action.payload;
			ensureVendorState(state, vendor);
			state[vendor].items = state[vendor].items.filter(item =>
				item._id !== itemId ||
				!isSameItem(item.selectedItems, selectedItems) ||
				item.variant !== variant
			);
			state[vendor].total = state[vendor].items.reduce((sum, item) => sum + item.defaultPrice * item.quantity, 0);
		},
		removeFromCart: (state, action) => {
			const {vendor, itemId} = action.payload;
			ensureVendorState(state, vendor);
			state[vendor].items = state[vendor].items.filter(item => item._id !== itemId);
			state[vendor].total = state[vendor].items.reduce((sum, item) => sum + item.defaultPrice * item.quantity, 0)
		},
		clearCart: (state, action) => {
			const vendor = action.payload;
			ensureVendorState(state, vendor);
			state[vendor].items = [];
			state[vendor].total = 0;
		},
		addModifierPrices: (state, action) => {
			const {vendor, itemId, modifierPrices, selectedItems} = action.payload;
			
			const existingItem = state[vendor].items.find(item => item._id === itemId);
			existingItem.modifierPrices = modifierPrices;
			existingItem.selectedItems = Array.from(selectedItems);
		}
	},
})

export const {
	addToCart, addItemToCart,
	decreaseCount, removeFromCart,
	changeItemCount, clearCart,
	addModifierPrices, removeItemFromCart
} = cartSlice.actions;

export default cartSlice.reducer;