import { Inject, Injectable } from "@nestjs/common";
import type { IUserRepository } from "../../domain/user.repository";
import { CreateUserDto } from "./create.dto";
import { User } from "src/users/domain/user.entity";
import { randomUUID } from "crypto";
import { UserAlreadyExistsError } from "src/users/domain/errors/user.error";
import { DI_TOKENS } from "../di.tokens";
import { HashedPassword } from "src/users/domain/hashed-password.vo";
import type { GhibliFilm, IGhibliGateway } from "src/users/domain/ports/in/ghibli.gateway";
import { UserResponseDTO } from "../dtos/user-response.dto";
import { UserResponseMapper } from "../mappers/user-response.mapper";
import { FilmsByIds } from "../utils/films-by-ids";

@Injectable()
export class CreateUserUseCase {

    constructor(
        @Inject(DI_TOKENS.USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(DI_TOKENS.GHIBLI_GATEWAY)
        private readonly ghibliGateway: IGhibliGateway
    ){}

    async execute(userDTO: CreateUserDto): Promise<UserResponseDTO> {

        let userFilms: GhibliFilm[] = []
        const existingUser = await this.userRepository.findByEmail(userDTO.email);

        if (existingUser) {
            throw new UserAlreadyExistsError(userDTO.email)
        }
        
        const user = new User(
            randomUUID(),
            userDTO.name,
            userDTO.email,
            await HashedPassword.hashPassword(userDTO.password),
            userDTO.favoriteFilmIds
        )

        try {
            const userCreated = await this.userRepository.create(user)
            if (userCreated.favoriteFilmIds.length > 0) {
                const films = await FilmsByIds.getFilmsByIds(userCreated.favoriteFilmIds, this.ghibliGateway)
                userFilms = films
            }
            return UserResponseMapper.toResponseCreated(userCreated, userFilms);
        } catch (error) {
            throw new Error(`Failed to create user: ${error}`)
        }
        
    }
}