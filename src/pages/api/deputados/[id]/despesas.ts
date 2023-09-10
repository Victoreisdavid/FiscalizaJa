import { NextApiRequest, NextApiResponse } from "next";
import DadosAbertosApi from "../../../../functions/api";

const api = new DadosAbertosApi("server")

export default async function Deputado(req: NextApiRequest, res: NextApiResponse) {
    const id = Number(req.query.id)

    const pagina = Number(req.query.pagina) || 1
    const ordenarPor = req.query.ordenarPor as string || "ano"
    const meses = Array.isArray(req.query.meses) ? req.query.meses.map((num) => parseInt(num, 10)) : [parseInt(req.query.meses, 10)]
    const anos = Array.isArray(req.query.anos) ? req.query.anos.map((num) => parseInt(num, 10)) : [parseInt(req.query.anos, 10)]
    const fornecedor = req.query.fornecedor as string || undefined

    if(!id || isNaN(id)) {
        return res.status(404).send({
            error: "not found"
        })
    }

    const despesas = await api.obter_gastos_deputado(id, pagina, ordenarPor, meses, anos, fornecedor) // Eu deveria mesmo ter feito nomes em português?

    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "*")

    return res.status(200).send({ dados: despesas })
}