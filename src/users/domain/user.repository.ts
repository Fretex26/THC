import { User } from "./user.entity";

export interface IUserRepository {
    create(user: User): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise <User | null>;
    update(user: User): Promise<void>;
    delete(id:string): Promise<void>;
}