import "../styles/main.scss";
import type { AppProps } from "next/app";

import { Analytics } from "@vercel/analytics/react";
import { SessionProvider } from "next-auth/react";
import Script from "next/script";

import Notification from "../components/Notification";

export default function App({ Component, pageProps }: AppProps) {

    return (
        <>
            <Notification message="A plataforma do governo está apresentando instabilidades, tente novamente!" />
            <div id="site-container">
                <SessionProvider session={pageProps.session}>
                    <Component {...pageProps} />
                </SessionProvider>
                <Analytics />
                <Script
                    id="adsbygoogle-init"
                    strategy="afterInteractive"
                    crossOrigin="anonymous"
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1687869791607147"
                />
            </div>
        </>
    )
}