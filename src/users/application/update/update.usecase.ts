import { Inject, Injectable } from "@nestjs/common";
import { DI_TOKENS } from "../di.tokens";
import type { IUserRepository } from "src/users/domain/user.repository";
import { UpdateUserDto } from "./update.dto";
import { UserNotFoundError } from "src/users/domain/errors/user.error";

@Injectable()
export class UpdateUserUseCase {

    constructor(
        @Inject(DI_TOKENS.USER_REPOSITORY)
        private readonly userRepository: IUserRepository
    ) {}

    async execute(userDTO: UpdateUserDto): Promise<void>{

        const existingUser = await this.userRepository.findByEmail(userDTO.email);

        if (!existingUser) {
            throw new UserNotFoundError(userDTO.email)
        }

        existingUser.update(userDTO.name, userDTO.email, userDTO.favoriteFilmIds)

        await this.userRepository.update(existingUser)

    }

}