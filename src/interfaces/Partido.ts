interface Partido {
    id: number,
    nome: string,
    numeroEleitoral: number,
    sigla: string,
    status: {
        data: string,
        idLegislatura: string,
        lider: {
            idLegislatura: number,
            nome: string,
            siglaPartido: string,
            uf: string,
            uri: string,
            uriPartido: string,
            urlFoto: string
        },
        situacao: string,
        totalMembros: string,
        totalPosse: string,
        uriMembros: string
    },
    uri: string,
    urlFacebook: string,
    urlLogo: string,
    urlWebSite: string
    links: [
        {
            href: string,
            rel: string,
            type: string
        }
    ]
}

export type { Partido }