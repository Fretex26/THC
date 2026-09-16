import { User } from "src/users/domain/user.entity";
import { UserOrmEntity } from "../user.entity-orm";
import { HashedPassword } from "src/users/domain/hashed-password.vo";
import { UUID } from "crypto";

export class UserMapperOrm {

    static toOrmUser(user: User): UserOrmEntity {

        const ormUser = new UserOrmEntity()

        ormUser.id = user.id
        ormUser.name = user.name
        ormUser.email = user.email
        ormUser.password = user.password.hashedValue()
        ormUser.favoriteFilmIds = user.favoriteFilmIds

        return ormUser

    }

    static async toDomainUser(ormUser: UserOrmEntity): Promise<User> {

        return new User(
            ormUser.id as UUID,
            ormUser.name,
            ormUser.email,
            await HashedPassword.fromHash(ormUser.password),
            ormUser.favoriteFilmIds as UUID[]
        )
        
    }

}