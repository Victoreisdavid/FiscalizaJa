import Img from "next/image";
import style from "../styles/home.module.scss";
import Head from "next/head";

export default function HomePage() {

    return (
        <>
            <Head>
                <title>FiscalizaJá: Gastos dos deputados, ao fácil acesso.</title>
                <meta name="description" content="FiscalizaJá é um website com objetivo de mostrar todos os gastos dos deputados que representam o povo, com uma interface intuitiva e de fácil entendimento. Sem omissões, sem dificuldades, sem >>medo<<!" />
            </Head>
            <header id={style.header}>
                <div id={style.text}>
                    <h1>FiscalizaJá!</h1>
                    <p>Despesas dos deputados federais ao fácil acesso.</p>
                    <a id={style.button} href="/deputados">Quero ver!</a>
                </div>
                <Img src="/vault.png" width={460} height={460} id={style.icon} alt="Vetor de um homem olhando por dentro de um cofre, que no contexto do FiscalizaJá, siginifica os cofres públicos com dinheiro do povo." />
            </header>
            <main id={style.main}>
                <div id="anchor" />
                <h1>O que você procura?</h1>
                <a href="/deputados">Essa seção foi movida para uma página. Clique aqui para ver a nova versão.</a>
            </main>
            <br />
        </>
    )
}