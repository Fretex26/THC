import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user")
export class UserOrmEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @Column("uuid", { array: true, default: [] })
    favoriteFilmIds: string[]
}