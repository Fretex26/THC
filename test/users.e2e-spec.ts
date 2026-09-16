import { INestApplication } from "@nestjs/common"
import { App } from "supertest/types"
import { DataSource } from "typeorm"
import { createE2EApp } from "./helpers/e2e-app.factory"
import { cleanDatabase } from "./helpers/database-cleaner.helper"
import { buildCreateUserPayload } from "./helpers/create-user-payload"
import request from "supertest"
import { MOCK_FILMS, MOCK_FILMS_IDS } from "./helpers/ghibli.mock"
import { USER_ERROR_CODES } from "src/users/domain/errors/user.error-codes"

describe('UsersController (e2e)', () =>{
    let app: INestApplication<App>
    let datasource: DataSource

    beforeAll(async () => {
        const context = await createE2EApp()
        app = context.app
        datasource = app.get(DataSource)
    })

    beforeEach(async () => {
        await cleanDatabase(datasource)
    })

    afterAll(async () => {
        await app.close()
    })

    describe('Post /users', () => {
        it('Creates a new user with favourite ghibli films (201)', async () => {
            const userPayload = buildCreateUserPayload()

            const response = await request(app.getHttpServer())
                .post('/users')
                .send(userPayload)
                .expect(201)

            expect(response.body).toMatchObject({
                name: userPayload.name,
                email: userPayload.email,
                favoriteFilms: MOCK_FILMS_IDS.map((id) => MOCK_FILMS[id])
            })
            expect(response.body.id).toEqual(expect.any(String))
            expect(response.body).not.toHaveProperty('password')
            
        })

        it('Creates a new user without favourite ghibli films (201)', async () => {
            const userPayload = buildCreateUserPayload({ favoriteFilmIds: [] })

            const response = await request(app.getHttpServer())
                .post('/users')
                .send(userPayload)
                .expect(201)

            expect(response.body.favoriteFilms).toEqual([])
            
        })

        it('Email already exists (409)', async () => {
            const userPayload = buildCreateUserPayload()

            await request(app.getHttpServer())
                .post('/users')
                .send(userPayload)
                .expect(201)

            const response = await request(app.getHttpServer())
                .post('/users')
                .send(userPayload)
                .expect(409)

            expect(response.body.code).toBe(USER_ERROR_CODES.ALREADY_EXISTS)
        })

        it('Invalid payload (400)', async () => {
            await request(app.getHttpServer())
                .post('/users')
                .send({
                    name: '',
                    email: 'bad-email',
                    password: '',
                })
                .expect(400)
        })
    })

    describe('GET /users/:email', () => {
        it('Returns a user by email (200)', async () => {
            const userPayload = buildCreateUserPayload()

            await request(app.getHttpServer())
                .post('/users')
                .send(userPayload)
                .expect(201)

            const response = await request(app.getHttpServer())
                .get(`/users/${userPayload.email}`)
                .expect(200)

            expect(response.body).toMatchObject({
                name: userPayload.name,
                email: userPayload.email,
                favoriteFilms: MOCK_FILMS_IDS.map((id) => MOCK_FILMS[id])
            })
        })

        it('User not found (404)', async () => {
            const response = await request(app.getHttpServer())
                .get(`/users/${encodeURIComponent('nonexisting@example.co')}`)
                .expect(404)

            expect(response.body.code).toBe(USER_ERROR_CODES.NOT_FOUND)
        })
    })

    describe('Patch /users/:email', () => {
        it('Updates an existing user (200)', async () => {
            const userPayload = buildCreateUserPayload()

            await request(app.getHttpServer())
                .post('/users')
                .send(userPayload)
                .expect(201)

            await request(app.getHttpServer())
                .patch('/users')
                .send({
                    email: userPayload.email,
                    name: 'Kal-El',
                    favoriteFilmIds: [MOCK_FILMS_IDS[0]]
                })
                .expect(200)

            const response = await request(app.getHttpServer())
                .get(`/users/${encodeURIComponent(userPayload.email)}`)
                .expect(200)

            expect(response.body.name).toBe('Kal-El')
            expect(response.body.favoriteFilms).toEqual([MOCK_FILMS[MOCK_FILMS_IDS[0]]])
        })

        it('Patch user not found (404)', async () => {
            const response = await request(app.getHttpServer())
                .patch('/users')
                .send({
                    email: 'nonexisting@example.com',
                    name: 'Kel-El',
                    favoriteFilmIds:[]
                })
            .expect(404)

            expect(response.body.code).toBe(USER_ERROR_CODES.NOT_FOUND)
        })
    })

    describe('Delete /users/:email', () => {
        it('Deletes an existing user (200). Get request returns 404 (404)', async () => {
            const userPayload = buildCreateUserPayload()

            await request(app.getHttpServer())
                .post('/users')
                .send(userPayload)
                .expect(201)

            await request(app.getHttpServer())
                .delete(`/users/${encodeURIComponent(userPayload.email)}`)
                .expect(200)

            await request(app.getHttpServer())
                .get(`/users/${encodeURIComponent(userPayload.email)}`)
                .expect(404)
        })

        it('Delete user not found (404)', async () => {
            const response = await request(app.getHttpServer())
                .delete(`/users/${encodeURIComponent('nonexisting@example.com')}`)
                .expect(404)

            expect(response.body.code).toBe(USER_ERROR_CODES.NOT_FOUND)
        })
    })
})