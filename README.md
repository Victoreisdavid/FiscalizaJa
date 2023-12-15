# 👋 Esse repositório foi descontinuado, mas não é o fim...

O FiscalizaJá recebeu uma grande atualização!

Nova versão: https://fiscalizaja.com

Antiga versão: https://legacy.fiscalizaja.com

Novos repositórios: https://github.com/FiscalizaJa

# Fiscaliza Já!
Fiscaliza Já é um website (talvez em um futuro, um aplicativo para celular) que mostra despesas dos deputados da câmara.

O projeto faz consumo da API dos [Dados Abertos](https://dadosabertos.camara.leg.br/) que apesar de dizer que os dados podem ser consumidos por qualquer um, não ativaram o CORS, o que impede desenvolvedores de consumir diretamente a API em seus websites (eu precisei fazer um proxy no backend para esse projeto!). Espero que apenas tenham esquecido (ou talvez não saibam) do CORS.

Caso você queira saber como usar a API dos dados abertos, aqui está o link da documentação:

https://dadosabertos.camara.leg.br/swagger/api.html

## 👀 Quando a ideia surgiu
Bom, tive a ideia de desenvolver isso quando li sobre o Brasiliapp no [TabNews](https://www.tabnews.com.br/MrRayzor/o-brasiliapp-acabou) (que foi descontinuado porque o desenvolvedor recebeu uma **ameaça de morte** em seu email, mais detalhes: https://brasiliapp.com.br/), achei interessante a ideia dele e resolvi desenvolver algo apartir dos dados abertos, e aqui está o Fiscaliza Já!

Eu sei que o projeto está bem "cru" ainda, há muitas coisas que estou desenvolvendo, e há algumas refatorações que farei no código para ficar mais limpo e fácil de dar manutenção.

Essa é a primeira versão, é uma versão beta e pode haver bugs.

Link: https://www.fiscalizaja.com

# 🚀 SelfHost
Aqui está o guia para você hospedar esse projeto você mesmo!

Requisitos:

- Node 16 pra cima
- Aplicativo configurado no Google Cloud Console (para poder usar o login com Google, na página de votos)
- Conta no https://turso.tech
- Um banco de dados criado no Turso (mais informações na documentação deles)

## Configure a .env

Crie um arquivo `.env` no diretório principal, e coloque o seguinte

```
NEXT_PUBLIC_API_URL="URL"

TURSO_DB_URL="URL do seu banco de dados no turso"
TURSO_DB_TOKEN="Auth token do seu banco de dados no turso"

GOOGLE_CLIENT_ID="Client ID do aplicativo no Google cloud console"
GOOGLE_SECRET_TOKEN="Secret token do aplicativo no Google cloud console"
```

Subsititua "URL" pela URL do seu website, dessa forma:
`https://website.example/api`.

🤔 Porque dessa forma???

Porque meu plano inicial era simplesmente consumir a API dos Dados Abertos, mas no meio do projeto eu descobri QUE OS CARAS NÃO ATIVARAM O CORS!!!!!!!!! e isso me frustrou bastante porque eu não queria fazer um backend, tentei muitas soluções alternativas porém...

precisei fazer um backend para usar como proxy 🤡

Passos:
- Instale as dependências: `npm install`.
- Rode o arquivo que cria as tabelas necessárias `node src/prepareDatabase.js`
- Faça build das páginas: `npm run build`.
- Inicie o Next em produção: `npm run start`.
- Está fazendo alterações? Use o modo de desenvolvimento: `npm run dev`.

É simples hospedar o projeto, você não vai ter muitas dificuldades!

E claro, lembrando que eu sou um desenvolvedor iniciante de 17 anos (nem sou adulto ainda), não espere um trabalho super profissional por aqui, mas eu me dediquei.
