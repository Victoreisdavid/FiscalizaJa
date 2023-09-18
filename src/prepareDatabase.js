/**
 * Esse arquivo irá preparar seu banco de dados para ser usado pelo FiscalizaJa.
 * Ao rodar, será criado todas as tabelas, dados e configurações necessárias para o banco de dados ser usado.
 */

const { createClient } = require("@libsql/client");

const dotenv = require("dotenv");

dotenv.config()

const config = {
    url: process.env.TURSO_DB_URL,
    authToken: process.env.TURSO_DB_TOKEN
}

const turso = createClient(config)

/**
 * Queries para criar todas as tabelas necessárias
 */
const query = `
create table votes (
    voteId text primary key,
    depId text,
    userEmail text,
    approves intenger
);
`

async function run() {
    console.log("Criando tabelas, por favor aguarde...")
    await turso.executeMultiple(query)
    console.log("Tabelas criadas, FiscalizaJa está pronto para ser iniciado.")
}

run()