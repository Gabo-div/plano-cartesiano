import type { AppProps } from "next/app";
import Head from "next/head";
import "../src/styles/global.css";

import { ChakraProvider } from "@chakra-ui/react";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>Plano Cartesiano</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<ChakraProvider>
				<Component {...pageProps} />
			</ChakraProvider>
		</>
	);
}

export default MyApp;
