import style from "../styles/navbar.module.scss";
import Modal from "./Modal";

import { HeartHandshake } from "lucide-react";
import { useState } from "react";

export default function Globalnav() {

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <nav id={style.global_nav}>
                <div id={style.about} onClick={() => setIsModalOpen(true)}>
                    <HeartHandshake /> Sobre
                </div>
            </nav>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h1>Luta pela transparência!</h1>
                <p>A política é do povo e para o povo. É nossa obrigação garantir que aqueles que nos representam usem corretamente nossos recursos públicos. É para isso que o FiscalizaJá existe!</p>
                <h2>Benefícios do FiscalizaJá:</h2>
                <ul>
                    <li><strong>Fácil acesso as informações:</strong> O FiscalizaJá não oferece uma UI complexa e cheia de coisas, somos certeiros ao ponto, que é a informação. Tudo é muito simples e organizado para que você e todo mundo possa compreender, analisar e contestar os dados.</li>
                    <li><strong>Tomada de decisão informada:</strong> Com dados claros sobre o histórico de gastos, você tem a possibilidade de tomar decisões informadas nas eleições. Chega de voto ás cegas!</li>
                    <li><strong>Comparar deputados:</strong> Com o FiscalizaJá, você pode comparar as despesas de dois deputados e traçar como cada um usa o nosso dinheiro.</li>
                    <li><strong>Combate a corrupção:</strong> O FiscalizaJá ajuda a revelar qualquer mau uso dos recursos públicos.</li>
                </ul>
                <h2>Como posso contribuir?</h2>
                <p>O FiscalizaJá é gratuito, de código aberto e não requer cadastro. No entanto, se você quiser e puder contribuir, sua doação ajudará a informar mais pessoas sobre o uso de dinheiro público por parte de nossos representantes.</p>
                <p>Caso queira doar, saiba que qualquer quantia ajuda e você pode doar diretamente via pix para <strong>victorreis5919@gmail.com</strong>.</p>
            </Modal>
        </>
    )
}