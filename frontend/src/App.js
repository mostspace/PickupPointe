import React, {useEffect} from "react";
import {BrowserRouter} from "react-router-dom";
import {HelmetProvider} from "react-helmet-async";
import {ModalProvider} from "src/contexts/ModalContext";
import {Provider} from "react-redux";
import {ToastContainer} from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

import store, {persistor} from "src/store/store";
// Routes
import Router from "src/routes/sections";

// theme
import ThemeProvider from "src/theme";

// components
import ScrollToTop from "src/components/scroll-to-top";
import {PersistGate} from "redux-persist/integration/react";
import {SocketProvider} from "src/contexts/socketContext.js";

export default function App() {
	useEffect(() => {
		const token = localStorage.getItem('token') || "";
		axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
		axios.defaults.baseURL = "https://stag-api.pickuppointe.com";
	}, []);

	return (
		<HelmetProvider>
			<Provider store={store}>
				<SocketProvider>
					<PersistGate loading={null} persistor={persistor}>
						<ToastContainer/>
						<ModalProvider>
							<BrowserRouter>
								<ThemeProvider>
									<ScrollToTop/>
									<Router/>
								</ThemeProvider>
							</BrowserRouter>
						</ModalProvider>
					</PersistGate>
				</SocketProvider>
			</Provider>
		</HelmetProvider>
	);
}

