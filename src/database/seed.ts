import dataSource from "src/database/data-source";
import { UserOrmEntity } from "src/users/infrastructure/persistence/user.entity-orm";
import * as bcrypt from 'bcrypt';

const SEED_USERS = [
    {
      name: 'Clark Kent',
      email: 'clark@kent.com',
      password: '123456',
      favoriteFilmIds: [
        '2baf70d1-42bb-4437-b551-e5fed5a87abe', // Castle in the Sky
        '58611129-2dbc-4a81-a72f-77ddfc1b1b49', // Kiki's Delivery Service
      ],
    },
    {
      name: 'Diana Prince',
      email: 'diana@prince.com',
      password: '123456',
      favoriteFilmIds: ['12cfb892-aac0-4c5b-94af-521852e46d6a'], // Grave of the Fireflies
    },
    {
      name: 'Bruce Wayne',
      email: 'bruce@wayne.com',
      password: '123456',
      favoriteFilmIds: [],
    },
    {
      name: 'Barry Allen',
      email: 'barry@allen.com',
      password: '123456',
      favoriteFilmIds: [
        '58611129-2dbc-4a81-a72f-77ddfc1b1b49',// My Neighbor Totoro
        '4e236f34-b981-41c3-8c65-f8c9000b94e7' // Only Yesterday
      ],
    },
  ];

async function seedUsers() {
    await dataSource.initialize()
    const repository = dataSource.getRepository(UserOrmEntity)

    for (const user of SEED_USERS) {
        const exists = await repository.findOne({ where: { email: user.email}})

        if (exists) {
            console.log(`User ${user.email} already exists`)
            continue
        }

        await repository.save(
            repository.create({
                name: user.name,
                email: user.email,
                password: await bcrypt.hash(user.password, 10),
                favoriteFilmIds: user.favoriteFilmIds
            })
        )

        console.log(`User ${user.email} seeded successfully`)
    }

    await dataSource.destroy()
}

seedUsers().catch((error) => {
    console.error('Error seeding users:', error)
    process.exit(1)
})