import { NextApiRequest, NextApiResponse } from "next";

import DadosAbertosApi from "../../../functions/DadosAbertosApi";

const api = new DadosAbertosApi("server")

export default async function Partido(req: NextApiRequest, res: NextApiResponse) {
    const id = Number(req.query.id)

    if(!id || isNaN(id)) {
        return res.status(404).send({
            error: "not found"
        })
    }

    const partido = await api.obter_partido(id)

    return res.send({ dados: partido })

}