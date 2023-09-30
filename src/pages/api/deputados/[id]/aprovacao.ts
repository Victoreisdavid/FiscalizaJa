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

    if(isNaN(id)) {
        return res.status(400).send({
            error: "ID inválido."
        })
    }

    const atual = await turso.execute(`SELECT * FROM votes WHERE depId = ${id};`)
    
    if(!atual.rows[0]?.length) {
        return res.status(200).send({
            dados: {
                aprova: 0,
                desaprova: 0,
                total: 0,
                indiceAprovacao: null,
                indiceReprovacao: null
            }
        })
    }

    const aprova = atual.rows.filter(dep => dep.approves === 1).length
    const desaprova = atual.rows.filter(dep => dep.approves === 0).length

    const total = aprova + desaprova
    
    return res.status(200).send({
        dados: {
            aprova,
            desaprova,
            total: total,
            indiceAprovacao: Math.round((100 * aprova) / total) || 0,
            indiceReprovacao: Math.round((100 * desaprova) / total) || 0
        }
    })
}