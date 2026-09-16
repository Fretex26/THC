import { UUID } from "crypto";

export class GhibliFilm {
    id!: UUID
    title!: string
}

export interface IGhibliGateway {
    getFilmsByIds(ids: UUID[]): Promise<GhibliFilm[]>
}