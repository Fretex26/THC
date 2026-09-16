import { TypeOrmModuleOptions } from "@nestjs/typeorm"

export const getTypeOrmConfig = (): TypeOrmModuleOptions =>{
    return{
        type: "postgres",
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT ?? "5432"),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        logging: process.env.NODE_ENV !== "test",
        synchronize: true,
        autoLoadEntities: true,
    }
}