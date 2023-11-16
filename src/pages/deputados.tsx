import Head from "next/head";
import Img from "next/image";
import Deputados from "../components/Deputados";
import style from "../styles/deputados.module.scss";
import Fuse from "fuse.js";

import { DeputadoResumo } from "../interfaces/Deputado";
import { PartidoResumo } from "../interfaces/Partido";

import { Search } from "lucide-react";

import DadosAbertosApi from "../functions/DadosAbertosApi";

import { useState, useRef } from "react";

const api = new DadosAbertosApi("server")

export async function getStaticProps() {
    const deputados = await api.obter_deputados()
    const partidos = await api.obter_partidos(1, 30)

    if(!deputados.length || !partidos.length) {
        throw new Error("API error")
        // Esse throw é feito para caso a API dos dados abertos retorne um erro, a última versão dos dados continue sendo usada, já que o revalidate é de 24 horas.
    } 

    return {
        props: {
            deputados,
            partidos
        },
        revalidate: 86400
    }
}

export default function ListaDeputados(props: { deputados: DeputadoResumo[], partidos: PartidoResumo[] }) {
    const [deputados, setDeputados] = useState(props.deputados)

    const partidos = props.partidos.map(partido => partido.sigla)
    const estados = ['Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal', 'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí', 'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia', 'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins']
    const UFs = { 'Acre':'AC','Alagoas':'AL','Amapá':'AP','Amazonas':'AM','Bahia':'BA','Ceará':'CE','Distrito Federal':'DF','Espírito Santo':'ES','Goiás':'GO','Maranhão':'MA','Mato Grosso':'MT','Mato Grosso do Sul':'MS','Minas Gerais':'MG','Pará':'PA','Paraíba':'PB','Paraná':'PR','Pernambuco':'PE','Piauí':'PI','Rio de Janeiro':'RJ','Rio Grande do Norte':'RN','Rio Grande do Sul':'RS','Rondônia':'RO','Roraima':'RR','Santa Catarina':'SC','São Paulo':'SP','Sergipe':'SE','Tocantins':'TO' };

    const partidoRef = useRef<HTMLSelectElement>()
    const estadoRef = useRef<HTMLSelectElement>()
    const pesquisaRef = useRef<HTMLInputElement>()

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

        const deputadosFiltrados = props.deputados.filter(deputado => {
            if(!estado) {
                return true
            } else {
                return deputado.siglaUf == UFs[estado]
            }
        }).filter(deputado => {
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

    const title = `FiscalizaJá: todos os ${deputados.length} deputados federais`

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={`Tenha acesso livre a todos os ${deputados.length} deputados da câmara e suas desepesas, ao fácil acesso.`} />
            </Head>
            <header id={style.header}>
                <h1>A fiscalização começa aqui.</h1>
                <p>Faça questão <strong>cobrar quem está nessa lista</strong>. Essa é uma das maneiras de <strong>mudar o país.</strong></p>
                <br />
                <p><a href="/compare">Clique aqui para comparar deputados!</a></p>
            </header>
            <main id={style.main}>
                <div id={style.search}>
                    <input type="text" id={style.search} placeholder="Kim Kataguiri" ref={pesquisaRef} />
                    <button onClick={() => {
                        filter()
                    }}><Search size={20} /></button>
                </div>
                <div id={style.filter}>
                    <label htmlFor="partidos">Partido: </label>
                    <select name="partidos" ref={partidoRef} onChange={() => {
                        filter()
                    }}>
                        <option value="todos">Todos</option>
                        { partidos.map(partido => (
                            <option key={partido} value={partido}>{partido}</option>
                        )) }
                    </select>
                    <div id={style.line}></div>
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
                <Deputados deputados={deputados} />
            </main>
        </>
    )
}