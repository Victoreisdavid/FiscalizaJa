import axios, { AxiosInstance } from "axios";
import type { DeputadoResumo, Deputado, Despesa } from "../interfaces/Deputado";
import type { Partido } from "../interfaces/Partido";

function getParam(url: string, param: string) {
    const params = url.split("?")[1]

    const values = params.split("&")

    const value = values.find(function(val: string) {
        const keyValue = val.split('=');
        return keyValue[0] === 'pagina';
    })

    if(value) {
        return value.split("=")[1]
    } else {
        return null
    }
}

async function delay(time: number) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true)
        }, time)
    })
}

class DadosAbertosApi {

    public runtime: "browser" | "server"
    public api: AxiosInstance

    constructor(runtime: "browser" | "server") {

        const serverUrl = "https://dadosabertos.camara.leg.br/api/v2" // URL usada no servidor (API routes)
        const browserUrl = process.env.NEXT_PUBLIC_API_URL // URL usada no navegador do usuário

        /**
         * Porquê duas urls?
         * resposta: Porque os desenvolvedores da API dos dados abertos não ativaram o CORS, o que faz as requisições no navegador serem barradas.
         */

        this.api = axios.create({
            baseURL: runtime === "browser" ? browserUrl : serverUrl,
            headers: {
                'Content-Type': "application/json", // A API dos dados abertos também suporta XML!
            }
        })
    }

    /**
     * # Obter deputados
     * Essa função obtém todos os deputados da lista dos dadosabertos.
     * @param itens Limite de deputados por página
     * @param page Número da página (necessário ter o limite)
     */
    async obter_deputados(itens?: number, page: number = 1): Promise<DeputadoResumo[] | null> {
        const deputados = await this.api.get(`/deputados`, {
            params: {
                itens: itens,
                pagina: page
            }
        }).catch((e) => { return { data: { dados: null } } })
        // -- Se retornar { data: { dados: null } } é porque a requisição deu errado, nesse caso, o site avisará ao usuário que a plataforma dados abertos está fora do ar no momento.
    
        //console.log(deputados.data)
    
        return deputados.data.dados
    }
    
    /**
     * # Obter um deputado
     * Essa função obtém um deputado através do seu ID.
     * @param id ID do deputado que deseja obter.
     */
    async obter_deputado(id: number): Promise<Deputado | null> {
        const deputado = await this.api.get(`/deputados/${id}`).catch((e) => { console.log(e); return { data: { dados: null } } })
        
        return deputado.data.dados
    }
    
    /**
     * # Obter gastos de um deputado pelo seu ID.
     * Essa função obtém todas as depesas de um deputado com informações detalhadas.
     * @param id ID do deputado que deseja obter.
     * @param pagina Página dos resultados
     * @param ordenarPor Ordenar com base em qualquer um dos campos do retorno.
     * 
     */
    async obter_gastos_deputado(id: number, pagina: number, ordenarPor: string = "ano", meses?: number[], ano?: number[], fornecedor: string = undefined, items?: number): Promise<{ dados: Despesa[], links: any } | null> {
        
        const params: {
            itens: number | null,
            pagina: number,
            ordenarPor: string,
            cnpjCpfFornecedor?: string,
            mes?: number[] | null,
            ano?: number[] | null
        } = {
            itens: items || null,
            pagina,
            ordenarPor,
            cnpjCpfFornecedor: fornecedor?.replace(/\D/g, "")
        }

        if(meses && !isNaN(Number(meses))) {
            params.mes = meses || null
        }

        if(ano && !isNaN(Number(ano))) {
            params.ano = ano
        }

        const gastos = await this.api.get(`/deputados/${id}/despesas`, {
            params,
            paramsSerializer: {
                indexes: null
            }
        }).catch((e) => { return { data: { dados: null, links: null } } })
    
        //console.log(gastos.data.dados)
    
        return gastos.data
    }

    /**
     * # Obter o total de gastos de um deputado em determinado ano.
     * Essa função retorna o total das despesas do deputado em um determinado ano.
     * @param id ID do deputado
     * @param ano Ano das despesas 
     */
    async obter_gastos_deputado_ano(id: number, ano: number): Promise<{ total: number, declarado: number, irregulares: { semComprovante: number } }> {
        const despesas = await this.api.get(`/deputados/${id}/despesas`, {
            params: {
                ano,
                itens: 150
            }
        }).catch(() => { return null })

        if(!despesas) {
            return null
        }

        let last = null

        const lastUrl = despesas.data.links.find(link => { return link.rel == "last" })?.href

        if(lastUrl) {
            last = getParam(lastUrl, "pagina")
        }

        let pagina = 2;

        const promises = []

        while(last !== null) {
            if(pagina > last) {
                break;
            }

            const proximas_despesas = this.api.get(`/deputados/${id}/despesas`, {
                params: {
                    ano,
                    itens: 150,
                    pagina
                }
            })

            promises.push(proximas_despesas)

            pagina += 1
        }
        
        let total = 0;

        const results = await Promise.all(promises)

        for(const result of results) {
            for(const dado of result.data.dados) {
                despesas.data.dados.push(dado)
            }
        }
        
        for(const despesa of despesas.data.dados) {
            total += despesa.valorLiquido
        }

        const semComprovante = despesas.data.dados.filter(despesa => {
            return !despesa.urlDocumento
        })

        return {
            total,
            declarado: despesas.data.dados.length,
            irregulares: {
                semComprovante: semComprovante.length
            }
        }
    }

    /**
     * # Obter dados de um partido
     * Obtém dados de um partido pelo seu ID.
     * @param id ID do partido
     */
    async obter_partido(id: number): Promise<Partido> {
        const partido = await this.api.get(`/partidos/${id}`).catch((e) => { return { data: { dados: null } } })

        return partido.data.dados
    }

    /**
     * # Obter todos os partidos
     * Obtém todos os partidos que estão em ação na câmara dos deputados.
     */
    async obter_partidos(page?: number, limit?: number) {
        const partidos = await this.api.get("/partidos", {
            params: {
                pagina: page,
                itens: limit
            }
        }).catch((e) => {
            return { data: { dados: null } }
        })

        return partidos.data.dados
    }
}

export default DadosAbertosApi