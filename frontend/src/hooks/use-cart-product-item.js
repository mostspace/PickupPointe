import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	addToCart,
	decreaseCount,
	removeFromCart,
	removeItemFromCart,
	addItemToCart,
	changeItemCount
} from 'src/reducers/cartSlice';

export default function useCartProductItem({ products = [], available = 100, vendor }) {
	const dispatch = useDispatch();

	const cartState = useSelector((state) => state.cart);
	const cartItems = cartState[vendor]?.items || [];

	const [quantities, setQuantities] = useState(null);
	const [selectedCartItem, setSelectedCartItem] = useState(null);
	const [openCustomizationOptions, setOpenCustomizationOptions] = useState(false);

	useEffect(() => {
		const initialQuantities = products.reduce((acc, product) => {
			acc[product._id] = 0;
			const cartItem = cartItems.find(item => item._id == product._id);
			if (cartItem) {
				acc[cartItem._id] = cartItem.quantity
			}
			return acc;
		}, {});
		setQuantities(initialQuantities);
	}, [products]);

	const onDecrease = (itemId) => {
		setQuantities((prevQuantities) => {
			const currentQuantity = prevQuantities[itemId];
			if (currentQuantity > 0) {
				return {
					...prevQuantities,
					[itemId]: currentQuantity - 1,
				};
			}
			return prevQuantities; // Return the previous state if no change is needed
		});
		dispatch(decreaseCount({vendor, itemId}));
	};

	const onClickDecrease = (itemId, selectedItems, variant) => {
		dispatch(changeItemCount({vendor, itemId, selectedItems, type: false, available, variant}));
	};

	const onIncrease = (itemId) => {
		setQuantities((prevQuantities) => {
			const currentQuantity = prevQuantities[itemId];
			if (currentQuantity < available) {
				return {
					...prevQuantities,
					[itemId]: currentQuantity + 1,
				};
			}
			return prevQuantities; // Return the previous state if no change is needed
		});
		dispatch(addToCart({vendor, product: products.find((product) => product._id === itemId)}))
	};

	const onClickIncrease = (itemId, selectedItems, variant) => {
		dispatch(changeItemCount({vendor, itemId, selectedItems, type: true, available, variant}));
	};

	const onClickClear = (itemId, selectedItems, variant) => {
		dispatch(removeItemFromCart({vendor, itemId, selectedItems, variant}));
	};

	const onClear = (itemId) => {
		setQuantities((prevQuantities) => {
			return {
				...prevQuantities,
				[itemId]: 0,
			};
		})
		dispatch(removeFromCart({vendor, itemId}))
	}

	const handleCustomizationOptionsOpen = () => {
		setOpenCustomizationOptions(true);
	};

	const handleCustomizationOptionsClose = () => {
		setOpenCustomizationOptions(false);
	};

	const handleClickAddToCart = ({itemId, modifierPrices, selectedItems, quantity, selectedVariant}) => {
		const product = products.find((product) => product._id === itemId);
		dispatch(addItemToCart({vendor, product, selectedItems, modifierPrices, quantity, selectedVariant}));
	};

	const handleAddToCart = (itemId) => {
		setSelectedCartItem(itemId);
		const product = products.find((product) => product._id === itemId)
		if (product.modifiers && product.modifiers.length > 0) {
			handleCustomizationOptionsOpen();
		} else {
			setQuantities((prevQuantities) => {
				const currentQuantity = prevQuantities[itemId];
				if (currentQuantity < available) {
					return {
						...prevQuantities,
						[itemId]: currentQuantity + 1,
					};
				}
				return prevQuantities; // Return the previous state if no change is needed
			});
			dispatch(addItemToCart({vendor, product: product, selectedItems: [], variant: ""}));
		}
	};

	const handleOpenCart = (itemId) => {
		setSelectedCartItem(itemId);
		const product = products.find((product) => product._id === itemId)
		if (product.modifiers && product.modifiers.length > 0) {
			handleCustomizationOptionsOpen();
		}
	}

	const selectedProduct = selectedCartItem
		? products.find((product) => product._id === selectedCartItem)
		: null;

	return {
		selectedProduct,
		onDecrease,
		onClickDecrease,
		onIncrease,
		onClickIncrease,
		onClear,
		onClickClear,
		handleAddToCart,
		handleClickAddToCart,
		handleCustomizationOptionsOpen,
		handleCustomizationOptionsClose,
		handleOpenCart,
		openCustomizationOptions,
		quantities,
	};
}
