import { UUID } from "crypto";

export class CreateUserDto {
    name: string;
    email: string;
    password: string;
    favoriteFilmIds?: UUID[]
}