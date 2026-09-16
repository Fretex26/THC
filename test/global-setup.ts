import { config } from "dotenv";
import path from "path";
import { Client } from "pg";

config({
    path: path.resolve(
        __dirname, 
        process.env.DOCKER_TEST === "true"
          ? "../.env.docker-test"
          : "../.env.test"
        ),
    override: true
})

export default async function globalSetup(): Promise<void> {

    const database = process.env.DB_DATABASE

    if (!database) {
        throw new Error("DB_DATABASE is not defined on .env.test");
    }

    const client = new Client({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || "5432", 10),
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: 'postgres'
    })

    await client.connect()

    try {
        const dbExists = await client.query(
            'SELECT 1 FROM pg_database WHERE datname = $1',
            [database]
        )

        if (dbExists.rowCount === 0) {
            await client.query(`CREATE DATABASE ${database}`);
            console.log(`Database ${database} created successfully`);
        }
    } catch (error) {
        console.error('Error creating testdatabase:', error);
        throw error;
    } finally {
        await client.end();
    }
}