import { NextApiRequest, NextApiResponse } from "next";
import DadosAbertosApi from "../../functions/api";
import Fuse from "fuse.js";
import type { DeputadoResumo } from "../../interfaces/Deputado";

let fuse: Fuse<DeputadoResumo>;

const api = new DadosAbertosApi("server")

export default async function Deputados(req: NextApiRequest, res: NextApiResponse) {
    if(!fuse) {
        const deputados = await api.obter_deputados()
        fuse = new Fuse(deputados, {
            keys: ["nome"],
            distance: 0.2
        })
    }

    const query: unknown = req.query.s

    if(!query) {
        res.status(400).json({
            message: "Missing search",
            example: "/api/search?s=\"Kim\""
        })
    }

    const results = fuse.search(query, {
        limit: 10
    })

    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "*")

    return res.status(200).json(results.map(result => result.item))
}