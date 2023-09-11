import "../styles/main.scss";
import type { AppProps } from "next/app";

import { Analytics } from "@vercel/analytics/react";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <div id="site-container">
                <Component {...pageProps} />
                <Analytics />
            </div>
        </>
    )
}