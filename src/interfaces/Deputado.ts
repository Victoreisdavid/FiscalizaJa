interface DeputadoResumo {
    id: number,
    uri: string,
    nome: string,
    siglaPartido: string,
    uriPartido: string,
    siglaUf: string,
    idLegislatura: number,
    urlFoto: string,
    email: string
}

interface Gabinete {
    nome: string;
    predio: string;
    sala: string;
    andar: string;
    telefone: string;
    email: string;
}
  
interface UltimoStatus {
    id: number;
    uri: string;
    nome: string;
    siglaPartido: string;
    uriPartido: string;
    siglaUf: string;
    idLegislatura: number;
    urlFoto: string;
    email: string;
    data: string;
    nomeEleitoral: string;
    gabinete: Gabinete;
    situacao: string;
    condicaoEleitoral: string;
    descricaoStatus: string | null;
}
  
interface Deputado {
    id: number;
    uri: string;
    nomeCivil: string;
    ultimoStatus: UltimoStatus;
    cpf: string;
    sexo: string;
    urlWebsite: string | null;
    redeSocial: string[];
    dataNascimento: string;
    dataFalecimento: string | null;
    ufNascimento: string;
    municipioNascimento: string;
    escolaridade: string;
    links: { rel: string; href: string }[];
}

interface Despesa {
    ano: number,
    cnpjCpfFornecedor: string,
    codDocumento: number,
    codLote: number,
    codTipoDocumento: number,
    dataDocumento: string,
    mes: number,
    nomeFornecedor: string,
    numDocumento: string,
    numRessarcimento: string,
    parcela: number,
    tipoDespesa: string,
    tipoDocumento: string,
    urlDocumento: string,
    valorDocumento: number,
    valorGlosa: number,
    valorLiquido: number
}

export type { DeputadoResumo, Gabinete, UltimoStatus, Deputado, Despesa }