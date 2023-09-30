import { NextApiRequest, NextApiResponse } from "next";
import DadosAbertosApi from "../../functions/DadosAbertosApi";

const api = new DadosAbertosApi("server")

export default async function Deputados(req: NextApiRequest, res: NextApiResponse) {
    const limit: unknown = req.query.itens
    const page: unknown = req.query.pagina

    let deputados

    if(limit && !isNaN(limit as number)) {
        deputados = await api.obter_deputados(limit as number, page as number)
    } else {
        deputados = await api.obter_deputados()
    }

    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "*")

    return res.status(200).json({ dados: deputados })
}