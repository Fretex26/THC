import { UUID } from "crypto";
import { HashedPassword } from "./hashed-password.vo";

export class User {
    constructor(
        public readonly id: UUID,
        private _name: string,
        private _email: string,
        private _password: HashedPassword,
        private _favoriteFilmIds: UUID[] = []
    ) {}

    get name(): string {
        return this._name
    }

    get email(): string {
        return this._email
    }

    get password(): HashedPassword {
        return this._password
    }

    get favoriteFilmIds(): UUID[] {
        return this._favoriteFilmIds
    }

    update (name?: string, email?: string, favoriteFilmIds?: UUID[]) {

        if (name) {
            this._name = name
        }

        if (email) {
            this._email = email
        }

        if (favoriteFilmIds) {
            this._favoriteFilmIds = favoriteFilmIds
        }
    }
}