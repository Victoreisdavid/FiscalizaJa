import { NextApiRequest, NextApiResponse } from "next";
import DadosAbertosApi from "../../../functions/DadosAbertosApi";

const api = new DadosAbertosApi("server")

export default async function Deputado(req: NextApiRequest, res: NextApiResponse) {
    const id = Number(req.query.id)

    if(!id || isNaN(id)) {
        return res.status(404).send({
            error: "not found"
        })
    }

    const deputado = await api.obter_deputado(id) // Eu deveria mesmo ter feito nomes em português?

    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "*")

    return res.status(200).send({ dados: deputado })
}