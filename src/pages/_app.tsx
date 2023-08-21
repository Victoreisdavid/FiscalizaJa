import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <div id="site-container">
                <Component {...pageProps} />
            </div>
        </>
    )
}