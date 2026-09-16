import { UserResponseDto } from "../../controllers/dtos/user-response.dto";
import { UserResponseDTO } from "src/users/application/dtos/user-response.dto";

export class UserMapperResponse {

    static toResponse(user: UserResponseDTO): UserResponseDto {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            favoriteFilms: user.films
        }
    }

}