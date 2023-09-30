import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import DadosAbertosApi from "../../../../functions/DadosAbertosApi";
import crypto from "crypto";

import UseTurso from "../../../../turso";

const turso = UseTurso()
const api = new DadosAbertosApi("server")

export default async function Aprova(req: NextApiRequest, res: NextApiResponse) {
    
    const id = Number(req.query.id)
    const voto = req.query.aprova as string === "sim" ? 1 : 0

    if(isNaN(id)) {
        return res.status(400).send({
            error: "ID inválido."
        })
    }

    const session = await getServerSession(req, res, authOptions)
    
    if(!session) {
        return res.status(401).send({
            error: "Não está logado"
        })
    }

    const deputado = await api.obter_deputado(id)

    if(!deputado) {
        return res.status(404).send({
            error: "Deputado não encontrado."
        })
    }

    const atual = await turso.execute(`SELECT * FROM votes WHERE depId = ${id} and userEmail = "${session.user.email}";`)
    
    if(atual.rows.length > 0) {
        // Se já votou, então o voto será editado.
        await turso.execute(`UPDATE votes SET approves = ${voto} WHERE depId = ${id} and userEmail = "${session.user.email}";`)
        return res.status(200).send({
            message: "Seu voto foi computado! Como você já havia votado antes, editamos o seu voto."
        })
    } else {
        const voteId = crypto.randomUUID()

        await turso.execute(`INSERT INTO votes VALUES ("${voteId}", ${deputado.id}, "${session.user.email}", ${voto})`)
        return res.status(200).send({
            message: "Seu voto foi computado!"
        })
    }
}