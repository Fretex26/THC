import { UUID } from "crypto";
import { FilmResponseDTO } from "./film-response.dto";

export class UserResponseDTO {
    id: UUID;
    name: string;
    email: string;
    films: FilmResponseDTO[] = [];
}