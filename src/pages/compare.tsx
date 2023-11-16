import Head from "next/head";
import Img from "next/image";
import Fuse from "fuse.js";
import DadosAbertosApi from "../functions/DadosAbertosApi";
import Deputados from "../components/Deputados";

import style from "../styles/comparacaoDeputados.module.scss";
import depStyle from "../styles/deputados.module.scss";

import { GetServerSidePropsContext } from "next";
import { useState, useRef, useEffect } from "react";
import { Deputado, DeputadoResumo } from "../interfaces/Deputado";
import { PartidoResumo } from "../interfaces/Partido";
import { Search } from "lucide-react";

const serverApi = new DadosAbertosApi("server")
const clientApi = new DadosAbertosApi("browser")

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const ids = context.query?.deputy as any

    if(!Array.isArray(ids)) {
        const promises = []

        promises.push(serverApi.obter_deputados())
        promises.push(serverApi.obter_partidos(1, 30))

        const resolved = await Promise.all(promises)

        const deputados = resolved[0]
        const partidos = resolved[1]
        
        return {
            props: {
                selectSecond: true,
                deputados: ids ? deputados.filter((dep: any) => dep.id != ids) : deputados,
                deputadoAtualId: ids || null,
                partidos: partidos
            }
        }
    }

    const promises = []

    promises.push(serverApi.obter_deputado(ids[0]))
    promises.push(serverApi.obter_deputado(ids[1]))

    promises.push(serverApi.obter_gastos_deputado_ano(ids[0], 2023))
    promises.push(serverApi.obter_gastos_deputado_ano(ids[1], 2023))

    const deputies = await Promise.all(promises)

    return {
        props: {
            deputados: deputies,
            gastos: [
                deputies[2],
                deputies[3]
            ]
        }
    }

}

// Bars component
function Bars(props: { deputies: Deputado[], values: any[] }) {

    const { deputies, values } = props

    return (
        <>
            <p>Total: <strong>R$ {(values[0] + values[1]).toFixed(2)}</strong></p>
            <div className={style.bar_total} />
            <p>{deputies[0].ultimoStatus.nomeEleitoral}: <strong>R$ {Math.round(values[0])}</strong></p>
            <div className={Math.max(values[0], values[1]) == values[0] ? style.bar_no : style.bar_yes } style={{ width: `${(values[0] * 100) / (values[0] + values[1])}%` }} />
            <p>{deputies[1].ultimoStatus.nomeEleitoral}: <strong>R$ {Math.round(values[1])}</strong></p>
            <div className={Math.max(values[0], values[1]) == values[1] ? style.bar_no : style.bar_yes } style={{ width: `${(values[1] * 100) / (values[0] + values[1])}%` }} />

        </>
    )
}

export default function CompareDeputies(props: { deputados: Deputado[], gastos: any, deputadoAtualId?: number, partidos?: PartidoResumo[], selectSecond?: boolean }) {
    const { deputados, gastos, partidos, deputadoAtualId, selectSecond } = props

    const deputadoAtual: any = deputados.find((dep: any) => dep.id == deputadoAtualId)

    const [gastosDeputados, setGastos] = useState(gastos || null)
    const [listaDeputados, setDeputados] = useState(deputados)

    const [deputadoSelecionado, selecionar] = useState(null)

    const partidosLista = partidos?.map(partido => partido.sigla)
    const estados = ['Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal', 'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí', 'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia', 'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins']
    const UFs = { 'Acre':'AC','Alagoas':'AL','Amapá':'AP','Amazonas':'AM','Bahia':'BA','Ceará':'CE','Distrito Federal':'DF','Espírito Santo':'ES','Goiás':'GO','Maranhão':'MA','Mato Grosso':'MT','Mato Grosso do Sul':'MS','Minas Gerais':'MG','Pará':'PA','Paraíba':'PB','Paraná':'PR','Pernambuco':'PE','Piauí':'PI','Rio de Janeiro':'RJ','Rio Grande do Norte':'RN','Rio Grande do Sul':'RS','Rondônia':'RO','Roraima':'RR','Santa Catarina':'SC','São Paulo':'SP','Sergipe':'SE','Tocantins':'TO' };

    const partidoRef = useRef<HTMLSelectElement>()
    const estadoRef = useRef<HTMLSelectElement>()
    const pesquisaRef = useRef<HTMLInputElement>()

    useEffect(() => {
        if(!deputadoSelecionado) {
            return;
        }

        window.location.href += `${deputadoAtualId ? "&" : "?"}deputy=${deputadoSelecionado.id}`
    }, [deputadoSelecionado])

    let searchIndex = new Fuse(props.deputados, {
        keys: [
            "nome"
        ],
        distance: 0.1,
        threshold: 0.3
    })

    function filter() {
        const estado = estadoRef.current.value == "todos" ? undefined : estadoRef.current.value
        const partido = partidoRef.current.value == "todos" ? undefined : partidoRef.current.value
        
        const pesquisa = pesquisaRef.current.value

        const deputadosFiltrados = props.deputados.filter((deputado: any) => {
            if(!estado) {
                return true
            } else {
                return deputado.siglaUf == UFs[estado]
            }
        }).filter((deputado: any) => {
            if(!partido) {
                return true
            } else {
                return deputado.siglaPartido == partido
            }
        })

        searchIndex = new Fuse(deputadosFiltrados, {
            keys: ["nome"],
            distance: 0.1,
            threshold: 0.3
        })

        if(pesquisa) {
            const resultados = searchIndex.search(pesquisa)
            setDeputados(resultados.map(item => item.item))
        } else {
            setDeputados(deputadosFiltrados)
        }
    }

    if(selectSecond === true) {

        return (
            <>
                <Head>
                    <title>Comparação de deputados | FiscalizaJá</title>
                </Head>
                <header id={depStyle.header}>
                    <h1>{ deputadoAtual ? <>Selecione outro deputado</> : <>Selecione um deputado para começar</> }</h1>
                    <p>Compare despesas de { deputadoAtual ? <><strong>{deputadoAtual.nome}</strong> com outros deputados</> : "deputados" } no FiscalizaJá.</p>
                </header>
                <main id={depStyle.main}>
                    <div id={depStyle.search}>
                        <input type="text" id={style.search} placeholder="Kim Kataguiri" ref={pesquisaRef} />
                        <button onClick={() => {
                            filter()
                        }}><Search size={20} /></button>
                    </div>
                    <div id={depStyle.filter}>
                        <label htmlFor="partidos">Partido: </label>
                        <select name="partidos" ref={partidoRef} onChange={() => {
                            filter()
                        }}>
                        <option value="todos">Todos</option>
                        { partidosLista.map(partido => (
                            <option key={partido} value={partido}>{partido}</option>
                        )) }
                        </select>
                        <div id={depStyle.line}></div>
                        <label htmlFor="estados"> Estado: </label>
                        <select name="estados" ref={estadoRef} onChange={() => {
                            filter()
                        }}>
                        <option value="todos">Todos</option>
                        {
                            estados.map(estado => (
                                <option key={estado} value={estado}>{estado} - {UFs[estado]}</option>
                            ))
                        }
                    </select>
                </div>
                    <Deputados deputados={listaDeputados as any} setState={selecionar} />
                </main>
            </>
        )
    } else {
        const title = `Deputados federais ${deputados[0].ultimoStatus.nomeEleitoral} e ${deputados[1].ultimoStatus.nomeEleitoral} | FiscalizaJá`

        return (
            <>
                <Head>
                    <title>{title}</title>
                    <meta name="description" content={`Vamos comparar ${deputados[0].ultimoStatus.nomeEleitoral} com ${deputados[1].ultimoStatus.nomeEleitoral} e ver diferenças entre seus gastos, quem gastou mais com qual tipo de despesas e quem possui mais problemas em suas declarações, como comprovantes ausentes.`} />
                </Head>
                <header id={style.header}>
                    <h1 style={{ marginBottom: "4.2rem" }}>Comparação de gastos</h1>
                    <div id={style.images}>
                        <div>
                            <Img 
                                src={deputados[0].ultimoStatus.urlFoto}
                                alt={`Foto de perfil de ${deputados[0].ultimoStatus.nomeEleitoral}`}
                                width={120}
                                height={120}
                                className={style.img}
                            />
                            <p>{deputados[0].ultimoStatus.nomeEleitoral}</p>
                        </div>
                        <p id={style.vs}>x</p>
                        <div>
                        <Img 
                            src={deputados[1].ultimoStatus.urlFoto}
                            alt={`Foto de perfil de ${deputados[1].ultimoStatus.nomeEleitoral}`}
                            width={120}
                            height={120}
                            className={style.img}
                        />
                            <p>{deputados[1].ultimoStatus.nomeEleitoral}</p>
                        </div>
                    </div>
                </header>
                <main id={style.main}>
                    <div id={style.content}>
                        <h1>Gastos totais</h1>
                        <br />
                        <div id={style.bars}>
                            <p>Total: <strong>R$ {Math.round(gastosDeputados[0].total + gastosDeputados[1].total) || 0}</strong></p>
                            <div className={style.bar_total} />
                            <p>{deputados[0].ultimoStatus.nomeEleitoral}: <strong>R$ {Math.round(gastosDeputados[0].total) || 0}</strong></p>
                            <div className={Math.max(gastosDeputados[0].total, gastosDeputados[1].total) || 0 == gastosDeputados[1].total ? style.bar_yes : style.bar_no } style={{ width: `${(gastosDeputados[0].total * 100) / (gastosDeputados[1].total + gastosDeputados[0].total)}%` }} />
                            <p>{deputados[1].ultimoStatus.nomeEleitoral}: <strong>R$ {Math.round(gastosDeputados[1].total) || 0}</strong></p>
                            <div className={Math.max(gastosDeputados[0].total, gastosDeputados[1].total) || 0 == gastosDeputados[1].total ? style.bar_no : style.bar_yes } style={{ width: `${(gastosDeputados[1].total * 100) / (gastosDeputados[1].total + gastosDeputados[0].total)}%` }} />
    
                            <br />
    
                            <h1>Gastos por tipo</h1>
                            <h2>Irregulares</h2>
                            <p>Total: <strong>R$ {Math.round(gastosDeputados[0].tipos.semComprovante + gastosDeputados[1].tipos.semComprovante)}</strong></p>
                            <div className={style.bar_no} style={{ width: "100%" }}/>
                            <p>{deputados[0].ultimoStatus.nomeEleitoral}: <strong>R$ {Math.round(gastosDeputados[0].tipos.semComprovante)}</strong></p>
                            <div className={style.bar_no} style={{ width: `${(gastosDeputados[0].tipos.semComprovante * 100) / (gastosDeputados[1].tipos.semComprovante + gastosDeputados[0].tipos.semComprovante)}%` }} />
                            <p>{deputados[1].ultimoStatus.nomeEleitoral}: <strong>R$ {Math.round(gastosDeputados[1].tipos.semComprovante)}</strong></p>
                            <div className={style.bar_no} style={{ width: `${(gastosDeputados[1].tipos.semComprovante * 100) / (gastosDeputados[1].tipos.semComprovante + gastosDeputados[0].tipos.semComprovante)}%` }} />
                            <br />
                            <p>Esse dinheiro foi gasto sem ter um comprovante informado, para onde foi esse valor??</p>
    
                            <h2>Divulgação da atividade parlamentar</h2>
                            <Bars deputies={deputados} values={[gastosDeputados[0].tipos.atividade_parlamentar || 0, gastosDeputados[1].tipos.atividade_parlamentar || 0]}/>
    
                            <h2>Telefonia</h2>
                            <Bars deputies={deputados} values={[gastosDeputados[0].tipos.telefonia || 0, gastosDeputados[1].tipos.telefonia || 0]} />
                            
                            <h2>Locação de veículos</h2>
                            <Bars deputies={deputados} values={[ gastosDeputados[0].tipos.locacao_veiculos || 0, gastosDeputados[1].tipos.locacao_veiculos || 0 ]} />
    
                            <h2>Passagem aérea Sigepa</h2>
                            <Bars deputies={deputados} values={[ gastosDeputados[0].tipos.passagem_sigepa || 0, gastosDeputados[1].tipos.passagem_sigepa || 0 ]}/>
    
                            <h2>Manutenção de escritório de apoio a atividade parlamentar</h2>
                            <Bars deputies={deputados} values={[ gastosDeputados[0].tipos.manutencao_escritorio || 0, gastosDeputados[1].tipos.manutencao_escritorio || 0 ]} />
    
                            <h2>Combustíveis e lubrificantes</h2>
                            <Bars deputies={deputados} values={ [gastosDeputados[0].tipos.combustiveis || 0, gastosDeputados[1].tipos.combustiveis || 0] } />
                        
                            <h2>Passagens reembolsadas</h2>
                            <p>Total: <strong>R$ {Math.round(gastosDeputados[0].tipos.passagem_reembolso || 0 + gastosDeputados[1].tipos.passagem_reembolso || 0) || 0}</strong></p>
                            <div className={style.bar_total} style={{ width: "100%" }}/>
                            <p>{deputados[0].ultimoStatus.nomeEleitoral}: <strong>R$ {Math.round(gastosDeputados[0].tipos.passagem_reembolso || 0)}</strong></p>
                            <div className={style.bar_yes} style={{ width: `${(gastosDeputados[0].tipos.passagem_reembolso * 100) / (gastosDeputados[1].tipos.passagem_reembolso + gastosDeputados[0].tipos.passagem_reembolso)}%` }} />
                            <p>{deputados[1].ultimoStatus.nomeEleitoral}: <strong>R$ {Math.round(gastosDeputados[1].tipos.passagem_reembolso || 0)}</strong></p>
                            <div className={style.bar_yes} style={{ width: `${(gastosDeputados[1].tipos.passagem_reembolso * 100) / (gastosDeputados[1].tipos.passagem_reembolso + gastosDeputados[0].tipos.passagem_reembolso)}%` }} />
                        </div>
                    </div>
                </main>
            </>
        )
    }
}