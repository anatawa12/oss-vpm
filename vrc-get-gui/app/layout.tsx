import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/ReactToastify.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		// biome-ignore lint/a11y/useHtmlLang: we cannot determine the language of the content. we add in inner div.
		<html>
			<head>
				{/* eslint-disable-next-line @next/next/no-sync-scripts */}
				<script src="vrc-get:/global-info.js" />
				{/* eslint-disable-next-line @next/next/no-sync-scripts */}
				<script src="https://vrc-get.localhost/global-info.js" />
			</head>
			<body
				className={
					"font-sans w-screen h-screen flex flex-row overflow-hidden whitespace-nowrap"
				}
			>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
