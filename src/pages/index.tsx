import Img from "next/image";
import style from "../styles/home.module.scss";
import axios from "axios";
import Loading from "../components/Loading";
import Head from "next/head";

import Deputados from "../components/Deputados";
import { useState, useEffect } from "react";

import DadosAbertosAPi from "../functions/api";

import { ArrowRightSquare, ArrowLeftSquare } from "lucide-react";

const clientApi = new DadosAbertosAPi("browser")

export default function HomePage() {

    const [deputados, set_deputados] = useState([])
    const [page, set_page] = useState(1)
    const [isSearch, setSearch] = useState(false)

    async function load_all() {
        set_deputados([])
        const deputados = await clientApi.obter_deputados(10, page)
        
        if(!deputados) {
            document.querySelector<HTMLDivElement>(".hidden-warn").style.display = "block"
        }

        set_deputados(deputados || [])
    }

    useEffect(() => {

        const searchbar = document.querySelector<HTMLInputElement>(`#${style.search}`)

        let timeout = null
        searchbar.addEventListener("input", async (e) => {
            if(timeout) {
                clearTimeout(timeout)
                timeout = null
            }

            set_deputados([])
            setSearch(true)

            timeout = setTimeout(async () => {
                if(searchbar.value.length < 1) {
                    setSearch(false)
                    load_all()
                } else {
                    const searchRequest = await axios.get(`/api/search?s=${encodeURIComponent(searchbar.value)}`).catch(() => {
                        document.querySelector<HTMLDivElement>(".hidden-warn").style.display = "block"
                        return { data: [] }
                    })
                    set_deputados(searchRequest.data)
                }
            }, 500)
        })

        load_all()
    }, [])

    useEffect(() => {
        load_all()
    }, [page])

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
                    <a id={style.button} href="#anchor">Quero ver!</a>
                </div>
                <Img src="/vault.png" width={460} height={460} id={style.icon} alt="Vetor de um homem olhando por dentro de um cofre, que no contexto do FiscalizaJá, siginifica os cofres públicos com dinheiro do povo." />
            </header>
            <main id={style.main}>
                <div id="anchor" />
                <h1>O que você procura?</h1>
                <input id={style.search} type="text" placeholder="Kim Kataguiri" />
                { deputados && <Deputados deputados={deputados} /> }
                <br />
                { deputados?.length == 0 && <Loading /> }
                <br />
                <div id={style.page_selector}>
                    <button onClick={() => {
                        if(!isSearch) {
                            set_page(page > 1 ? page - 1 : page)
                        }
                    }} style={{ opacity: isSearch ? 0.5 : 1 }}><ArrowLeftSquare size={30} /></button>
                    <button onClick={() => {
                        if(!isSearch) {
                            set_page(page + 1)
                        }
                    }} style={{ opacity: isSearch ? 0.5 : 1 }}><ArrowRightSquare size={30} /></button>
                </div>
                <span>Página {page}</span>
            </main>
            <br />
        </>
    )
}