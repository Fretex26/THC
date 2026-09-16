import { Inject, Injectable } from "@nestjs/common";
import { DI_TOKENS } from "../di.tokens";
import type { IUserRepository } from "src/users/domain/user.repository";
import { User } from "src/users/domain/user.entity";
import { UserNotFoundError } from "src/users/domain/errors/user.error";
import type { IGhibliGateway } from "src/users/domain/ports/in/ghibli.gateway";
import { FilmsByIds } from "../utils/films-by-ids";
import { UserResponseMapper } from "../mappers/user-response.mapper";
import { UserResponseDTO } from "../dtos/user-response.dto";

@Injectable()
export class FindUserByEmailUseCase {

    constructor (
        @Inject(DI_TOKENS.USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(DI_TOKENS.GHIBLI_GATEWAY)
        private readonly ghibliGateway: IGhibliGateway
    ) {}
    
    async execute(email: string): Promise<UserResponseDTO> {

        const existingUser = await this.userRepository.findByEmail(email);

        if (!existingUser) {
            throw new UserNotFoundError(email);
        }

        const films = await FilmsByIds.getFilmsByIds(existingUser.favoriteFilmIds, this.ghibliGateway)

        return UserResponseMapper.toResponseCreated(existingUser, films)
    }
    
}