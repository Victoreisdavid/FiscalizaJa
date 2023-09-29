import { NextApiRequest, NextApiResponse } from "next";
import DadosAbertosApi from "../../functions/api";

const api = new DadosAbertosApi("server")

export default async function Partidos(req: NextApiRequest, res: NextApiResponse) {
    const partidos = await api.obter_partidos(1, 30)

    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "*")

    return res.status(200).json({ dados: partidos })
}