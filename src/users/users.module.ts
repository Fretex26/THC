import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './infrastructure/persistence/user.entity-orm';
import { DI_TOKENS } from './application/di.tokens';
import { UserRepositoryImpl } from './infrastructure/persistence/user.repository-impl';
import { CreateUserUseCase } from './application/create/create.usecase';
import { UpdateUserUseCase } from './application/update/update.usecase';
import { DeleteUserUseCase } from './application/delete/delete.usecase';
import { FindUserByEmailUseCase } from './application/read/read.usecase';
import { UserController } from './infrastructure/controllers/user.controller';
import { GhibliAPIClient } from './infrastructure/ghibli/ghibli-api.client';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserOrmEntity])
    ],
    providers: [
        {
            provide: DI_TOKENS.USER_REPOSITORY,
            useClass: UserRepositoryImpl
        },
        {
            provide: DI_TOKENS.GHIBLI_GATEWAY,
            useClass: GhibliAPIClient
        },
        CreateUserUseCase,
        UpdateUserUseCase,
        DeleteUserUseCase,
        FindUserByEmailUseCase
    ],
    controllers: [UserController]
})
export class UsersModule {}
