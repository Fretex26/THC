import { GhibliFilm } from "src/users/domain/ports/in/ghibli.gateway";
import { User } from "src/users/domain/user.entity";
import { UserResponseDTO } from "../dtos/user-response.dto";

export class UserResponseMapper {
    static toResponseCreated(user: User, films: GhibliFilm[]): UserResponseDTO {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            films: films
        }
    }
}