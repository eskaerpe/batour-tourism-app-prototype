import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";
import App from "./App";
import { LanguageProvider } from "./i18n/LanguageContext";
import { BookingProvider } from "./context/BookingContext";
import "./index.css";

registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<LanguageProvider>
			<BookingProvider>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</BookingProvider>
		</LanguageProvider>
	</React.StrictMode>,
);
