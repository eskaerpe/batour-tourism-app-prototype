import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: "autoUpdate",
			includeAssets: ["icons/icon-192.svg", "icons/icon-512.svg"],
			manifest: {
				name: "BaTour",
				short_name: "BaTour",
				description: "Personal travel assistant for Bandung",
				theme_color: "#ec5b13",
				background_color: "#f8fafc",
				display: "standalone",
				icons: [
					{ src: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
					{ src: "/icons/icon-512.svg", sizes: "512x512", type: "image/svg+xml" },
				],
			},
			workbox: {
				globPatterns: ["**/*.{js,css,html,svg,png,ico,json}"],
			},
		}),
	],
});
