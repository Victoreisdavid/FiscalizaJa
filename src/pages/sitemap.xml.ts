import axios from "axios";
import type { DeputadoResumo } from "../interfaces/Deputado";

async function generateSiteMap() {
    const request = await axios.get("https://dadosabertos.camara.leg.br/api/v2/deputados").catch((e) => {
        return null
    }) // preferi não usar o wrapper (DadosAbertosApi) aqui, para não sofrer nehuma modificação com alterações futuras

    if(!request) {
        return null
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
            <loc>https://www.fiscalizaja.com</loc>
            <changefreq>daily</changefreq>
        </url>
        ${request.data.dados.map((dep: DeputadoResumo) => {
            return `
                <url>
                    <loc>https://www.fiscalizaja.com/${dep.id}</loc>
                    <changefreq>daily</changefreq>
                </url>
            `
        })}
        </urlset>
  `;   
}

export default function Sitemap() {

}

export async function getServerSideProps({ res }) {
    res.setHeader('Content-Type', 'text/xml');
    
    const sitemap = await generateSiteMap()

    res.write(sitemap);
    res.end();

    return {
        props: {}
    }
}