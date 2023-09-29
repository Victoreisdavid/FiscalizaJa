import style from "../styles/navbar.module.scss";

import { ArrowLeft } from "lucide-react";

export default function Navbar() {
    return (
        <>
            <nav id={style.nav}>
                <a href="/deputados">
                    <ArrowLeft size={34} />
                </a>
            </nav>
        </>
    )
}