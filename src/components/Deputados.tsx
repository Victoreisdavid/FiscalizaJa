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
                            width={40}
                            height={40}
                            alt={`Foto do deputado ${deputado.nome}`}
                            style={{ objectFit: "cover", alignSelf: "center", borderRadius: "8px", mixBlendMode: "multiply" }}
                        />
                        <div className={style.text}>
                            <h1>{deputado.nome}</h1>
                        </div>
                    </a>
                )) }
            </section>
        </>
    )
}