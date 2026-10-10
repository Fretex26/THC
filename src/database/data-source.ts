import { DataSource, DataSourceOptions } from "typeorm";
import 'dotenv/config'
import { UserOrmEntity } from "src/users/infrastructure/persistence/user.entity-orm";

export const typeOrmOptions: DataSourceOptions = {
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? "5432", 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [__dirname + "/../**/*.entity-orm.{ts,js}"],
    migrations: [__dirname + "/migrations/*.{ts,js}"],
    synchronize: false,
}

export default new DataSource(typeOrmOptions);