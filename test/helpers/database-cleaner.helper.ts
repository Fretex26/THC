import { DataSource } from "typeorm";

export async function cleanDatabase(dataSource: DataSource) {
    const tableNames = dataSource.entityMetadatas
        .map(({ tableName }) => `"${tableName.replaceAll('"', '""')}"`)
        .join(", ");

    if (!tableNames) return;

    await dataSource.query(
        `TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE`,
    );
}