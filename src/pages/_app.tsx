import "../styles/main.scss";
import type { AppProps } from "next/app";

import { Analytics } from "@vercel/analytics/react";

import Notification from "../components/Notification";

export default function App({ Component, pageProps }: AppProps) {

    return (
        <>
            <Notification message="A plataforma do governo está apresentando instabilidades, tente novamente!" />
            <div id="site-container">
                <Component {...pageProps} />
                <Analytics />
            </div>
        </>
    )
}