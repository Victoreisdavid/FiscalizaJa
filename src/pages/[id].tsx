import Head from "next/head";
import Img from "next/image";
import Navbar from "../components/Navbar";
import DadosAbertosApi from "../functions/api";

import style from "../styles/deputado.module.scss"

import { GetServerSidePropsContext } from "next";
import { Deputado, Despesa } from "../interfaces/Deputado";
import { Partido } from "../interfaces/Partido";

import { CircleDollarSign, UserCircle, Newspaper, Building2, DollarSign, CalendarRange, Tag, FileSearch, User2, Wallet, MapPin, Mail, GraduationCap, ArrowLeftSquare, ArrowRightSquare, Clipboard, UserCheck2, Users2 } from "lucide-react";

import { useState, useEffect } from "react";

const serverApi = new DadosAbertosApi("server")
const clientApi = new DadosAbertosApi("browser") // esse será usado no lado do cliente

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const id: number = Number(context.query?.id) as number | undefined

    if(!id || isNaN(Number(id))) {
        return {
            notFound: true
        }
    }

    const deputado = await serverApi.obter_deputado(id)

    const uriPartido = deputado.ultimoStatus.uriPartido.split("/")

    const idPartido = Number(uriPartido[uriPartido.length - 1])

    const partido = await serverApi.obter_partido(idPartido)

    console.log(partido)

    if(!deputado) {
        return {
            notFound: true
        }
    }

    return {
        props: {
            deputado,
            partido
        }
    }
}

export default function Despesas(props: { deputado: Deputado, partido: Partido }) {
    const { deputado, partido } = props

    //console.log(deputado)

    const [despesas, setDespesas] = useState<Despesa[]>([])

    const [section, setSection] = useState<string>("despesas") // info, despesas ou partido

    const [page, setPage] = useState<number>(1)

    async function load() {
        const despesas = await clientApi.obter_gastos_deputado(deputado.id, page, "ano", [], [])

        setDespesas(despesas)
    }

    useEffect(() => {
        load()
    }, [page])

    const title = `Informações de ${deputado.nomeCivil}`

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={`Informações sobre o deputado ${deputado.nomeCivil}, sem omissões! Aproveite.`} />
            </Head>
            <Navbar />
            <header id={style.header}>
                <Img src={deputado.ultimoStatus.urlFoto} width={180} height={180} id={style.img} alt={`Foto de perfil do deputado ${deputado.ultimoStatus.nome}.`} />
                <h1>{deputado.nomeCivil}</h1>
                <p>{deputado.ultimoStatus.nome}</p>
            </header>
            <main id={style.main}>
                <nav>
                    <button onClick={() => { setSection("despesas") }}><CircleDollarSign size={44} /></button>
                    <button onClick={() => { setSection("info") }}><UserCircle size={44} /></button>
                    <button onClick={() => { setSection("partido") }}><Newspaper size={44} /></button>
                </nav>
                <section hidden={section !== "despesas"}>
                    <br />
                    <h2>Despesas</h2>
                    <div id={style.page_selector}>
                        <button onClick={() => { 
                            setPage(page > 1 ? page - 1 : page)    
                        }}><ArrowLeftSquare size={30} /></button>
                        <button onClick={() => {
                            setPage(page + 1)
                        }}><ArrowRightSquare size={30} /></button>
                    </div>
                    <div style={{ textAlign: "center" }}>Página {page}</div>
                    <br />
                    <div className={style.cards}>
                        {despesas && despesas.map(((despesa, i) => (
                            <div key={i}>
                                <h1><Building2 size={34} style={{ verticalAlign: "-8px" }} /> {despesa.nomeFornecedor}</h1>
                                <p><Tag size={30} style={{ verticalAlign: "-9px" }} /> {despesa.cnpjCpfFornecedor.length < 1 ? "N/A" : despesa.cnpjCpfFornecedor.length === 11 ? despesa.cnpjCpfFornecedor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : despesa.cnpjCpfFornecedor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')}</p>
                                <p><DollarSign size={30} style={{ verticalAlign: "-9px" }} /> R$ {despesa.valorLiquido}</p>
                                <p><CalendarRange size={30} style={{ verticalAlign: "-8px" }} /> {new Date(despesa.dataDocumento).toLocaleDateString()}</p>
                                <p><FileSearch size={30} style={{ verticalAlign: "-8px" }} /> <a href={despesa.urlDocumento || "#"} target="_blank">Documento/comprovante</a></p>
                            </div>
                        )))}
                    </div>
                </section>
                <section hidden={section !== "info"}>
                    <br />
                    <h2>Informações</h2>
                    <div className={style.cards}>
                        <div>
                            <h1><User2 size={34} style={{ verticalAlign: "-8px" }} />{deputado.nomeCivil}</h1>
                            <p><Wallet size={34} style={{ verticalAlign: "-9px" }} /> {deputado.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}</p>
                            <p><MapPin size={34}  style={{ verticalAlign: "-9px" }} /> {deputado.municipioNascimento}</p>
                            <p><GraduationCap size={34}  style={{ verticalAlign: "-9px" }} /> {deputado.escolaridade}</p>
                            <p><Mail size={34} style={{ verticalAlign: "-11px" }} /> {deputado.ultimoStatus.email}</p>
                        </div>
                    </div>
                    <br />
                </section>
                <section hidden={section !== "partido"}>
                    <br />
                    <h2>Partido</h2>
                    <div className={style.cards}>
                        <div>
                            <h1><Clipboard size={34} style={{ verticalAlign: "-8px" }}/> {partido.nome}</h1>
                            <p><UserCheck2 size={34} style={{ verticalAlign: "-8px" }} /> Liderado por {partido.status.lider.nome}</p>
                            <p><Users2 size={34} style={{ verticalAlign: "-8px" }} /> {partido.status.totalMembros} membros</p>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}