import {useSocket} from "src/contexts/socketContext.js";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

const MerchantSocketHandler = () => {
	const socket = useSocket();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const {merchant} = useSelector(state => state.merchant.auth);
	
	useEffect(() => {
		if (socket) {
			socket.on("order.new", newOrder => {
				console.log(newOrder)
				toast("A new order has been placed.", { type: "success", className: 'toast-custom' });
			})
			
			socket.on("chat.new_message", (newMessage) => {
				if (newMessage.receiverId === merchant._id) {
					toast("A new message has arrived.", { type: "success", className: 'toast-custom', onClick: navigate("/merchant/all-orders") });
				}
			});
		}
		return () => {
			socket.off("order.new");
		};
	}, []);
};

export default MerchantSocketHandler;