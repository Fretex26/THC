import { UUID } from "crypto";
import { GhibliFilm, IGhibliGateway } from "src/users/domain/ports/in/ghibli.gateway";

export class GhibliAPIClient implements IGhibliGateway {

    async getFilmsByIds(ids: UUID[]): Promise<GhibliFilm[]> {
        try {
            const films = await Promise.allSettled(
                ids.map(async (id) => {
                    const response = await fetch(`${process.env.GHIBLI_FILMS_URL}/${id}?fields=id,title`)
                    if (!response.ok) {
                        throw new Error(`Ghibli API error: ${response.status}`);
                    }
                    return await response.json()
                }) 
            )
    
            return films.filter(film => film.status === 'fulfilled').map(film => film.value)
            
        } catch (error) {
            throw new Error(`Failed to get films from Ghibli API: ${error}`)
        }
    }
}