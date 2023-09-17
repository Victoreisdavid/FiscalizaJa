import { createClient } from "@libsql/client/.";

export default function UseTurso() {
    const config = {
        url: process.env.TURSO_DB_URL!,
        authToken: process.env.TURSO_DB_TOKEN!
    }

    return createClient(config)
}