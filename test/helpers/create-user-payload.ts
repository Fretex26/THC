import { randomUUID } from 'crypto';
import { MOCK_FILMS_IDS } from './ghibli.mock';

type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
  favoriteFilmIds?: string[];
};

export function buildCreateUserPayload(
  overrides: Partial<CreateUserPayload> = {},
): CreateUserPayload {
  return {
    name: 'Clark Kent',
    email: `clark.${randomUUID()}@kent.com`,
    password: '123456',
    favoriteFilmIds: [...MOCK_FILMS_IDS],
    ...overrides,
  };
}