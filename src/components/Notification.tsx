import style from "../styles/notification.module.scss";

export default function Notification(props: { message: string }) {
    return (
        <div id={style.container} className="hidden-warn">
            <p>{props.message}</p>
        </div>
    )
}