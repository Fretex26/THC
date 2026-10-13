import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { typeOrmOptions } from "./data-source"

export const getTypeOrmConfig = (): TypeOrmModuleOptions =>({
    ...typeOrmOptions,
    logging: process.env.NODE_ENV !== "test",
    autoLoadEntities: true,
})