import { Injectable } from "@nestjs/common";
import { User } from "src/users/domain/user.entity";
import { IUserRepository } from "src/users/domain/user.repository";
import { UserOrmEntity } from "./user.entity-orm";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserMapperOrm } from "./mappers/user.mapper-orm";

@Injectable()
export class UserRepositoryImpl implements IUserRepository {

    constructor(
        @InjectRepository(UserOrmEntity)
        private readonly userRepository: Repository<UserOrmEntity>
    ) {}

    async create(user: User): Promise<User> {
        const ormUser = UserMapperOrm.toOrmUser(user)
        const savedOrmUser = await this.userRepository.save(ormUser)
        return UserMapperOrm.toDomainUser(savedOrmUser)
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { email }})
        if (!user) return null
        return UserMapperOrm.toDomainUser(user)
    }

    async findById(id: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { id }})
        if (!user) return null
        return UserMapperOrm.toDomainUser(user)
    }

    async update(user: User): Promise<void> {
        const ormUser = UserMapperOrm.toOrmUser(user)
        try {
            await this.userRepository.save(ormUser)
        } catch (error) {
            throw new Error(`Error updating user: ${error.message}`)
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.userRepository.delete(id)
        } catch (error) {
            throw new Error(`Error deleting user: ${error.message}`)
        }
    }
}