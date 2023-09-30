import Head from "next/head";
import Img from "next/image";
import Navbar from "../components/Navbar";
import DadosAbertosApi from "../functions/DadosAbertosApi";
import axios from "axios";

import style from "../styles/deputado.module.scss"

import { GetServerSidePropsContext } from "next";
import { Deputado, Despesa } from "../interfaces/Deputado";
import { Partido } from "../interfaces/Partido";

import { CircleDollarSign, UserCircle, Newspaper, Building2, DollarSign, CalendarRange, Tag, FileSearch, User2, Wallet, MapPin, Mail, GraduationCap, ArrowLeftSquare, ArrowRightSquare, Clipboard, UserCheck2, Users2, CalendarDays, ChevronRight, ChevronLeft } from "lucide-react";

import { useState, useEffect, useRef } from "react";
import Loading from "../components/Loading";

const serverApi = new DadosAbertosApi("server")
const clientApi = new DadosAbertosApi("browser") // esse será usado no lado do cliente

const UFs = {'AC':'Acre','AL':'Alagoas','AP':'Amapá','AM':'Amazonas','BA':'Bahia','CE':'Ceará','DF':'Distrito Federal','ES':'Espírito Santo','GO':'Goiás','MA':'Maranhão','MT':'Mato Grosso','MS':'Mato Grosso do Sul','MG':'Minas Gerais','PA':'Pará','PB':'Paraíba','PR':'Paraná','PE':'Pernambuco','PI':'Piauí','RJ':'Rio de Janeiro','RN':'Rio Grande do Norte','RS':'Rio Grande do Sul','RO':'Rondônia','RR':'Roraima','SC':'Santa Catarina','SP':'São Paulo','SE':'Sergipe','TO':'Tocantins'}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const id: number = Number(context.query?.id) as number | undefined

    if(!id || isNaN(Number(id))) {
        return {
            notFound: true
        }
    }

    const deputado = await serverApi.obter_deputado(id).catch(() => {
        return null
    })

    if(!deputado) {
        return {
            notFound: true
        }
    }

    const uriPartido = deputado.ultimoStatus.uriPartido.split("/")
    const idPartido = Number(uriPartido[uriPartido.length - 1])
    const partido = await serverApi.obter_partido(idPartido)

    const nascimentoAno = new Date(deputado.dataNascimento).getFullYear()
    const nascimentoMes = new Date(deputado.dataNascimento).getMonth() + 1
    const anoAtual = new Date().getFullYear()
    const mesAtual = new Date().getMonth()

    const idade = anoAtual - nascimentoAno

    return {
        props: {
            deputado,
            partido,
            idade: mesAtual < nascimentoMes ? idade + 1 : idade // Se passou o mês do aniversário, a idade ele tem de ser somada em 1.
        }
    }
}

export default function Despesas(props: { deputado: Deputado, partido: Partido, idade: number }) {
    const { deputado, partido, idade } = props

    //console.log(deputado)

    const [loading, setLoading] = useState<boolean>(true)

    const [despesas, setDespesas] = useState<Despesa[]>([])
    const [totalDespesa, setTotalDespesa] = useState<{ total: number, ano: number, declarado: number }>({ ano: new Date().getFullYear(), declarado: 0, total: 0 })
    const [carregandoDespesa, setCarregandoDespesa] = useState(false)
    const [anoDespesa, setAnoDespesa] = useState<number>(new Date().getFullYear())

    const [aprovacao, setAprovacao] = useState(null)

    const [section, setSection] = useState<string>("despesas") // info, despesas ou partido

    const [page, setPage] = useState<number>(1)

    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    const [mesesSelecionados, selecionarMes] = useState(meses)

    const anoSelecionado = useRef(null)
    const fornecedor = useRef(null)

    async function load() {
        const numeroMeses = mesesSelecionados.map((mes) => {
            const index = meses.findIndex((procuraMes) => {
                return mes === procuraMes
            })
            return index === -1 ? null : index + 1
        }).filter(numero => numero > -1)

        console.log(numeroMeses)

        const ano = anoSelecionado.current.value || null
        const cpfCnpj = fornecedor.current.value || null

        setDespesas([])
        setLoading(true)

        const despesas = await clientApi.obter_gastos_deputado(deputado.id, page, "ano", numeroMeses, [ano], cpfCnpj, 10).catch(() => {
            return null
        })
        
        if(!despesas) {
            document.querySelector<HTMLDivElement>(".hidden-warn").style.display = "block"
        }

        const aprovacoes = await axios.get(`/api/deputados/${deputado.id}/aprovacao`).catch((e) => {
            return {
                data: { dados: null }
            }
        })

        setAprovacao(aprovacoes.data.dados)

        setDespesas(despesas || [])
        setLoading(false)
    }

    async function load_total() {
        setCarregandoDespesa(true)
        const { total, declarado } = await clientApi.obter_gastos_deputado_ano(deputado.id, anoDespesa)

        setTotalDespesa({ total, declarado, ano: anoDespesa })
        setAnoDespesa(anoDespesa)
        setCarregandoDespesa(false)

        return total
    }

    useEffect(() => {
        load()
    }, [page])

    useEffect(() => {
        if(carregandoDespesa) {
            return; // Existem usuários impacientes que ficam clicando insistentemente, não faremos nenhum outro carregamento enquanto o atual não terminar.
        }
        load_total()
    }, [anoDespesa])

    function gerenciaMes(mes: string) {
        const atual = mesesSelecionados.find((m) => m === mes)

        if(atual) {
            selecionarMes(mesesSelecionados.filter(m => m !== mes))
        } else {
            selecionarMes(selecionados => [...selecionados, mes])
        }
    }

    function aplicar() {
        const numeroMeses = mesesSelecionados.map((mes) => {
            const index = meses.findIndex((procuraMes) => {
                return mes === procuraMes
            })
            return index === -1 ? null : index
        }).filter(numero => numero > -1)


    }

    const title = `Informações de ${deputado.nomeCivil}`

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={`Estamos mostrando informações, partido e despesas de ${deputado.nomeCivil} ao fácil acesso!`} />
            </Head>
            <Navbar />
            <header id={style.header}>
                <Img src={deputado.ultimoStatus.urlFoto} width={180} height={180} id={style.img} alt={`Foto de perfil do deputado ${deputado.ultimoStatus.nome}.`} />
                <h1>{deputado.nomeCivil}</h1>
                <p>{deputado.ultimoStatus.nome}</p>
                <div id={style.details}>
                    <h2>Índice de aprovação</h2>
                    <div id={style.bars}>
                        <p>Total: {aprovacao?.total || 0}</p>
                        <div id={style.bar_total} />
                        <p>Aprova: {aprovacao?.aprova || 0} ({aprovacao?.indiceAprovacao || 0}%)</p>
                        <div id={style.bar_yes} style={{ width: aprovacao?.indiceAprovacao ? `${aprovacao?.indiceAprovacao}%` : 0 }} />
                        <p>Desaprova: {aprovacao?.desaprova || 0} ({aprovacao?.indiceReprovacao || 0}%)</p>
                        <div id={style.bar_no} style={{ width: aprovacao?.indiceReprovacao ? `${aprovacao?.indiceReprovacao}%` : 0 }} />
                    </div>
                    <a href={`/${deputado.id}/votar`}>Quero votar!</a>
                </div>
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
                    <div id={style.totals_card} hidden={!totalDespesa}>
                        <ChevronLeft size={55} onClick={() => {
                            const ano = totalDespesa.ano
                            setAnoDespesa(ano - 1)
                        }}/>
                        <div>
                            <h1>Período {totalDespesa?.ano}</h1>
                            <p id={style.total}>{carregandoDespesa ? "Carregando..." : `R$ ${Number(totalDespesa?.total.toFixed(2)).toLocaleString("en-US").replace(/,/g, ".") || "unknown"}`}</p>
                            <p id={style.declarados}>{totalDespesa?.declarado} compras declaradas</p>
                        </div>
                        <ChevronRight size={55} onClick={() => {
                            const ano = totalDespesa.ano
                            if(ano + 1 > new Date().getFullYear()) {
                                return;
                            }
                            setAnoDespesa(ano + 1)
                        }}/>
                    </div>
                    <div id={style.filter}>
                        <h2>Opções de filtro</h2>
                        <div id={style.content}>
                            <label htmlFor="meses">Meses: </label>
                            <select id="meses" onChange={(e) => { 
                                gerenciaMes(meses[Number(e.target.value) - 1])
                                e.target.selectedIndex = -1
                             }}>
                                { meses.map((mes: string, index) => ( 
                                    <option value={index + 1} key={index} className={mesesSelecionados.find((procuraMes) => mes === procuraMes) ? `${style.selected}` : ""}>{mes}</option>
                                )) }
                            </select>
                            <label htmlFor="ano">Ano: </label>
                            <input id="ano" type="number" defaultValue={new Date().getFullYear()} size={3} ref={anoSelecionado} />
                            <br /> <br />
                            <label htmlFor="fornecedor">Fornecedor (CPF ou CNPJ): </label>
                            <input type="text" placeholder="123.456.789-12" ref={fornecedor} />
                            <br />
                            <button onClick={() => {
                                load()
                            }}>Aplicar</button>
                        </div>
                    </div>
                    <div className={style.cards}>
                        {despesas && despesas.map(((despesa, i) => (
                            <div key={i}>
                                <h1>{despesa.cnpjCpfFornecedor.length === 11 ? <User2 size={34} style={{ verticalAlign: "-8px" }} /> : <Building2 size={34} style={{ verticalAlign: "-8px" }} /> } {despesa.nomeFornecedor}</h1>
                                <p><Tag size={30} style={{ verticalAlign: "-9px" }} /> {despesa.cnpjCpfFornecedor.length < 1 ? <span className="bad-warn">CPF/CNPJ ausente</span> : despesa.cnpjCpfFornecedor.length === 11 ? despesa.cnpjCpfFornecedor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : despesa.cnpjCpfFornecedor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')}</p>
                                <p><DollarSign size={30} style={{ verticalAlign: "-9px" }} /> {despesa.valorLiquido ? `R$ ${despesa.valorLiquido}` : <span className="bad-warn">Valor ausente</span>}</p>
                                <p><CalendarRange size={30} style={{ verticalAlign: "-8px" }} /> {new Date(despesa.dataDocumento).toLocaleDateString()}</p>
                                <p><FileSearch size={30} style={{ verticalAlign: "-8px" }} /> <a href={despesa.urlDocumento || "#"} target="_blank">{despesa.urlDocumento ? "Documento/comprovante" : <span className="bad-warn">Comprovante ausente</span>}</a></p>
                            </div>
                        )))}
                    </div>
                    <br />
                    { loading && <Loading /> }
                    <div id={style.page_selector}>
                        <button onClick={() => { 
                            setPage(page > 1 ? page - 1 : page)    
                        }}><ArrowLeftSquare size={30} /></button>
                        <button onClick={() => {
                            setPage(page + 1)
                        }}><ArrowRightSquare size={30} /></button>
                    </div>
                    <div style={{ textAlign: "center" }}>Página {page}</div>
                </section>
                <section hidden={section !== "info"}>
                    <br />
                    <h2>Informações</h2>
                    <div className={style.cards}>
                        <div>
                            <h1><User2 size={34} style={{ verticalAlign: "-8px" }} />{deputado.nomeCivil}</h1>
                            <p><Wallet size={34} style={{ verticalAlign: "-9px" }} /> {deputado.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}</p>
                            <p><CalendarDays size={34} style={{ verticalAlign: "-8px" }} /> {idade} anos</p>
                            <p><MapPin size={34}  style={{ verticalAlign: "-9px" }} /> {deputado.municipioNascimento}, {UFs[deputado.ufNascimento.toUpperCase()]}</p>
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