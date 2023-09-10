import type { DeputadoResumo } from "../interfaces/Deputado";
import style from "../styles/deputados.module.scss";
import Img from "next/image";

export default function Deputados(props: { deputados: DeputadoResumo[] }) {
    return (
        <>
            <section className={style.container}>
                { props.deputados.map((deputado) => (
                    <a className={style.dep} key={deputado.id} href={`/${deputado.id}`}>
                        <Img 
                            src={deputado.urlFoto}
                            width={110}
                            height={130}
                            alt={`Foto do deputado ${deputado.nome}`}
                            style={{ objectFit: "cover", boxShadow: "0px 0px 1px #2A2D34", alignSelf: "center", borderRadius: "8px" }}
                        />
                        <div className={style.text}>
                            <h1>{deputado.nome}</h1>
                            <p>{deputado.siglaPartido} / {deputado.siglaUf}</p>
                            <p style={{ fontSize: "1.2em" }}>{deputado.email}</p>
                        </div>
                    </a>
                )) }
            </section>
        </>
    )
}