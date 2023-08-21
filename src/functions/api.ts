import axios from "axios";
import type { DeputadoResumo, Deputado, Despesa } from "../interfaces/Deputado";

const api = axios.create({
    baseURL: "https://dadosabertos.camara.leg.br/api/v2/",
    headers: {
        'Content-Type': "application/json" // A API dos dados abertos também suporta XML!
    }
})


/**
 * # Obter deputados
 * Essa função obtém todos os deputados da lista dos dadosabertos.
 * @param limit Limite de deputados por página
 * @param page Número da página (necessário ter o limite)
 */
async function obter_deputados(limit?: number, page: number = 1): Promise<DeputadoResumo[] | null> {
    const deputados = await api.get(`/deputados${limit ? `?itens=${limit}&pagina=${page}` : ""}`).catch((e) => { return { data: { dados: null } } })
    // -- Se retornar { data: { dados: null } } é porque a requisição deu errado, nesse caso, o site avisará ao usuário que a plataforma dados abertos está fora do ar no momento.

    return deputados.data.dados
}

/**
 * # Obter um deputado
 * Essa função obtém um deputado através do seu ID.
 * @param id ID do deputado que deseja obter.
 */
async function obter_deputado(id: string): Promise<Deputado | null> {
    const deputado = await api.get(`/deputados/${id}`).catch((e) => { return { data: { dados: null } } })
    
    return deputado.data.dados
}

/**
 * # Obter gastos de um deputado pelo seu ID.
 * Essa função obtém todas as depesas de um deputado com informações detalhadas.
 * @param id ID do deputado que deseja obter.
 */
async function obter_gastos_deputado(id: string): Promise<Despesa[] | null> {
    const gastos = await api.get(`/deputados/${id}/despesas`).catch((e) => { return { data: { dados: null } } })

    return gastos.data.dados
}

export default { obter_deputado, obter_deputados, obter_gastos_deputado }