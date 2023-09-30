import style from "../../styles/avisos.module.scss";
import Head from "next/head";
import Navbar from "../../components/Navbar";

export default function AvisoPlataformaInstavel() {
    return (
        <div id={style.container}>
            <Navbar />
            <header>
                <h1>"A plataforma está apresentando instabilidades"</h1>
            </header>
            <main>
                <p>Este aviso aparece quando o <a href="https://dadosabertos.camara.leg.br" target="_blank">Dados Abertos</a> está apresentando instabilidades em seu funcionamento.</p>
                <p>Infelizmente, o FiscalizaJá depende da disponibilidade da plataforma para poder exibir as informações, e o Dados Abertos frequentemente está apresentando problemas em seu funcionamento.</p>
                <p>Felizmente, estamos estudando uma maneira de manter o acesso aos dados, independente da disponibilidade do Dados Abertos (nesse caso, apenas usariámos para sincronizar nossa base de dados).</p>
            </main>
        </div>
    )
}