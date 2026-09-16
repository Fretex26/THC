import { Inject, Injectable } from "@nestjs/common";
import { DI_TOKENS } from "../di.tokens";
import type { IUserRepository } from "src/users/domain/user.repository";
import { UserNotFoundError } from "src/users/domain/errors/user.error";

@Injectable()
export class DeleteUserUseCase {

    constructor(
        @Inject(DI_TOKENS.USER_REPOSITORY)
        private readonly userRepository: IUserRepository
    ) {}

    async execute(email: string ): Promise<void> {

        const existingUser = await this.userRepository.findByEmail(email);

        if (!existingUser) {
            throw new UserNotFoundError(email);
        }

        await this.userRepository.delete(existingUser.id)
    }

}