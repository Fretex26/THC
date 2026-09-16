import { UUID } from "crypto"
import { GhibliFilm, IGhibliGateway } from "src/users/domain/ports/in/ghibli.gateway"

export class FilmsByIds {

    static async getFilmsByIds(ids: UUID[], ghibliGateway: IGhibliGateway): Promise<GhibliFilm[]> {
        if (ids.length === 0) {
            return []
        }
        const films = await ghibliGateway.getFilmsByIds(ids)
        return films
    }
}