import axios, { AxiosInstance } from "axios";
import type { DeputadoResumo, Deputado, Despesa } from "../interfaces/Deputado";
import type { Partido } from "../interfaces/Partido";

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
    async obter_gastos_deputado(id: number, pagina: number, ordenarPor: string = "ano", meses?: number[], anos?: number[], fornecedor: string = undefined): Promise<Despesa[] | null> {
        
        const params: {
            itens: number,
            pagina: number,
            ordenarPor: string,
            fornecedor?: string,
            meses?: number[],
            anos?: number[]
        } = {
            itens: 10,
            pagina,
            ordenarPor,
            fornecedor
        }

        if(meses) {
            params.meses = meses
        }

        if(anos) {
            params.anos = anos
        }

        const gastos = await this.api.get(`/deputados/${id}/despesas`, {
            params: {
                itens: 10,
                pagina,
                ordenarPor,
                fornecedor
            },
            paramsSerializer: {
                indexes: null
            }
        }).catch((e) => { return { data: { dados: null } } })
    
        //console.log(gastos.data.dados)
    
        return gastos.data.dados
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
}

export default DadosAbertosApi