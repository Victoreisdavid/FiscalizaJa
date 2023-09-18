import { GetServerSidePropsContext } from "next";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import DadosAbertosApi from "../../functions/api";
import Img from "next/image";
import Head from "next/head";
import { Deputado } from "../../interfaces/Deputado";
import axios from "axios";

import style from "../../styles/votar.module.scss";

const serverApi = new DadosAbertosApi("server")
const clientApi = new DadosAbertosApi("browser")

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const id = Number(context.params?.id)

    if(!id) {
        return {
            notFound: true
        }
    }

    const deputado = await serverApi.obter_deputado(id)

    if(!deputado) {
        return {
            notFound: true
        }
    }

    return {
        props: {
            deputado
        }
    }
}

export default function VotePage(props: { deputado: Deputado }) {
    const { deputado } = props

    const { data, status } = useSession()
    const [display, setDisplay] = useState("none")

    const [voto, setVoto] = useState(null)

    useEffect(() => {
        if(voto === null) {
            return // ainda não votou, não faz nada
        }

        async function computeVote() {
            const aprova = voto === 1 ? "sim" : "não"
            const request = await axios.get(`/api/deputados/${deputado.id}/aprova`, {
                params: {
                    aprova
                }
            }).catch((e) => {
                return null
            })
        }
        computeVote()
    }, [voto])

    if(status === "loading") {
        return (
            <>
                <header id={style.informative_header}>
                    <div>
                        <h1>Por favor aguarde</h1>
                        <p>Estamos carregando seu login...</p>
                    </div>
                    <Img src="/auth_loading.gif" width={150} height={150} style={{ objectFit: "cover" }} id={style.img} alt="Animação de uma digital, representa que as informações do seu login estão sendo processadas. Aguarde alguns segundos." />
                </header>
            </>
        )
    }

    if(status === "unauthenticated") {
        return (
            <>
                <header id={style.informative_header}>
                    <div>
                        <h1>Você precisa fazer login primeiro</h1>
                        <p>É só selecionar sua conta Google! :D</p>
                        <button className={style.button} onClick={() => signIn("google")}>Login</button>
                    </div>
                    <Img src="/need_login.png" width={150} height={150} id={style.img} alt="Ilustração de um homem abrindo uma porta, significa que você precisa fazer login." />
                </header>
            </>
        )
    }

    if(status === "authenticated") {
        if(voto !== null) {
            return (
                <>
                    <header id={style.informative_header}>
                        <div>
                            <h1>Seu voto foi computado.</h1>
                            <p>Obrigado por contribuir com o índice do FiscalizaJá!</p>
                            <p>Nota: se você já votou nesse deputado, seu voto foi editado.</p>
                        </div>
                        <Img src="/vote_computed.svg" width={150} height={150} id={style.img} alt="Ilustração de duas pessoas comemorando, é porque ao votar, você está contribuindo para o índice do FiscalizaJa! Obrigado!" />
                    </header>
                </>
            )
        } else {
            return (
                <>
                    <main id={style.content}>
                        <h1>Olá, {data.user.name}!</h1>
                        
                        <Img src={deputado.ultimoStatus.urlFoto} width={100} height={100} quality={50} alt={`Foto do deputado ${deputado.nomeCivil}`} id={style.img}/>
                        <p>{deputado.nomeCivil}</p>
                        <p className={style.separate}>Você <strong>aprova</strong> este deputado?</p>
                        <div id={style.voting_buttons}>
                            <button className={style.button} id={style.yes} onClick={() => setVoto(1)}>Sim</button>
                            <button className={style.button} id={style.no} onClick={() => setVoto(0)}>Não</button>
                        </div>
    
                        <br />
                        <p className={style.gray} style={{ cursor: "pointer" }} onClick={() => setDisplay("block")}>Está em dúvida?</p>
                        <div id={style.reqs} style={{ display: display }}>
                            <h2 className={style.separate}>Quais requisitos um deputado deve ter?</h2>
                            <br />
                            <p>Se você está em dúvida se aprova ou não, é altamente recomedável que você pesquise antes. Valorize o seu voto!</p>
                            <p>No entanto, para te ajudar, vamos citar alguns requisitos básicos que um deputado deve seguir:</p>
                            <br />
                            <ul>
                                <li><strong>Ser representante do povo brasileiro:</strong> Os deputados federais devem agir de acordo com os interesses da população e defender os direitos dos cidadãos.</li>
                                <li><strong>Ser transparente e responsável:</strong> Os deputados federais devem prestar contas de suas ações e evitar conflitos de interesse.</li>
                                <li><strong>Ser honesto e ético:</strong> Os deputados federais devem agir de acordo com os princípios da ética e da moral.</li>
                            </ul>
                            <br />
                            <p>Há muitos outros requisitos que um deputado deve seguir, mas você pode começar por estes acima.</p>
                            <p>Se para você, o deputado não segue algum dos requisitos, <strong>então você deve votar não</strong>.</p>
                            <p>Lembre-se: Sempre pesquise antes de votar, voto às cegas prejudicou o nosso país!</p>
                        </div>
                    </main>
                </>
            )
        }
    }
}