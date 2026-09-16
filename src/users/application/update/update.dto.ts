import { UUID } from "crypto"

export class UpdateUserDto {
    name?: string
    email: string
    favoriteFilmIds?: UUID[]
}