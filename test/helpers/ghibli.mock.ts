import { UUID } from "crypto";
import { GhibliFilm, IGhibliGateway } from "src/users/domain/ports/in/ghibli.gateway";

export const MOCK_FILMS: Record<string, GhibliFilm> = {
    '2baf70d1-42bb-4437-b551-e5fed5a87abe': {
    id: '2baf70d1-42bb-4437-b551-e5fed5a87abe',
    title: 'Castle in the Sky',
  },
  '58611129-2dbc-4a81-a72f-77ddfc1b1b49': {
    id: '58611129-2dbc-4a81-a72f-77ddfc1b1b49',
    title: "Kiki's Delivery Service",
  }
}

export const MOCK_FILMS_IDS = Object.keys(MOCK_FILMS) as UUID[]

export function createGhibliGatewayMock(): jest.Mocked<IGhibliGateway> {
  return {
    getFilmsByIds: jest.fn(async (ids: UUID[]) =>
      ids
        .map(id => MOCK_FILMS[id])
        .filter((film): film is GhibliFilm => film !== undefined)
    )
  }
}