import type { DeputadoResumo } from "../interfaces/Deputado";
import style from "../styles/deputados.module.scss";
import Img from "next/image";
import React from "react";

function Link(props: { deputado: DeputadoResumo }) {
    const { deputado } = props
    
    return (
        <>
            <a className={style.dep} key={deputado.id} href={`/${deputado.id}`}>
                <Img 
                    src={deputado.urlFoto}
                    width={40}
                    height={40}
                    alt={`Foto do deputado ${deputado.nome}`}
                    style={{ objectFit: "cover", alignSelf: "center", borderRadius: "8px", mixBlendMode: "multiply" }}
                    loading="lazy"
                />
                <div className={style.text}>
                    <h1>{deputado.nome}</h1>
                </div>
            </a>
        </>
    )
}

function Div(props: { deputado: DeputadoResumo, setState?: React.Dispatch<React.SetStateAction<DeputadoResumo>> }) {
    const { deputado, setState } = props
    
    return (
        <div className={style.dep} key={deputado.id} style={{ cursor: "pointer" }} onClick={(e) => {
            setState(deputado)
        }}>
            <Img 
                src={deputado.urlFoto}
                width={40}
                height={40}
                alt={`Foto do deputado ${deputado.nome}`}
                style={{ objectFit: "cover", alignSelf: "center", borderRadius: "8px", mixBlendMode: "multiply" }}
                loading="lazy"
            />
            <div className={style.text}>
                <h1>{deputado.nome}</h1>
            </div>
        </div>
    )
}



export default function Deputados(props: { deputados: DeputadoResumo[], setState?: React.Dispatch<React.SetStateAction<DeputadoResumo>>}) {

    if(!props.setState) {
        return (
            <>
                <section className={style.container}>
                    { props.deputados.map((deputado) => (
                        <Link deputado={deputado}/>
                    )) }
                </section>
            </>
        )
    } else {
        return (
            <>
                <section className={style.container}>
                    { props.deputados.map((deputado) => (
                        <Div deputado={deputado} setState={props.setState} />
                    )) }
                </section>
            </>
        )
    }
}