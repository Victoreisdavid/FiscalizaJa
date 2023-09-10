import style from "../styles/loader.module.scss";

export default function Loading() {
    return (
        <>
            <div style={{ margin: "auto", textAlign: "center" }}>
                <div className={style.loader} />
                <p>Carregando...</p>
            </div>
        </>
    )
}