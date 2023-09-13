import { NextApiRequest, NextApiResponse } from "next";
import  DadosAbertosApi from "../../../../../../functions/api";

const api = new DadosAbertosApi("server")

export default async function Total(req: NextApiRequest, res: NextApiResponse) {
    const id = Number(req.query.id)

    if(!id) {
        return res.status(404).send({
            error: "not found"
        })
    }

    const ano = Number(req.query.ano)

    if(!ano) {
        return res.status(400).send({
            error: "bad request"
        })
    }

    const total = await api.obter_gastos_deputado_ano(id, ano)
    
    return res.status(200).send({
        dados: {
            ano,
            ...total
        }
    })
}