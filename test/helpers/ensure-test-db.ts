import { config } from "dotenv";
import path from "path";
import { Client } from "pg";

config({
    path: path.resolve(
        __dirname,
        process.env.DOCKER_TEST === "true" ? "../../.env.docker-test" : "../../.env.test"
    ),
    override: true
});

export async function ensureTestDB(): Promise<void> {
    const database = process.env.DB_DATABASE

    if (!database) {
        throw new Error("The Test environment variable DB_DATABASE is not set");
    }

    const client = new Client({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || "5432", 10),
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: "postgres"
    })

    await client.connect()

    try {
        const dbExists = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [database])

        if (dbExists.rowCount === 0) {
            await client.query(`CREATE DATABASE "${database}"`)
            console.log(`Database ${database} created successfully`)
        }
    } finally {
        await client.end()
    }
}

if (require.main === module) {
    ensureTestDB()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error("Error creating test database:", error)
            process.exit(1)
        })
}