/**
 * Esse arquivo irá preparar seu banco de dados para ser usado pelo FiscalizaJa.
 * Ao rodar, será criado todas as tabelas, dados e configurações necessárias para o banco de dados ser usado.
 */

import { createClient } from "@libsql/client"

import dotenv from "dotenv";

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
create table users (
    id text,
    email text,
    createdAt text,
    verified intenger default "0" not null,
    verificationToken text null,
    primary key (id, email)
);
create table votes (
    voteId text primary key,
    depId text,
    userEmail text,
    approves intenger
)
`

async function run() {
    console.log("Criando tabelas, por favor aguarde...")
    await turso.executeMultiple(query)
    console.log("Tabelas criadas, FiscalizaJa está pronto para ser iniciado.")
}

run()