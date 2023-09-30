import style from "../styles/notification.module.scss";

export default function Notification(props: { message: string, about?: string }) {
    return (
        <div id={style.container} className="hidden-warn">
            <p>{props.message} {props.about && <a href={props.about} target="_blank">Saiba Mais</a>}</p>
        </div>
    )
}