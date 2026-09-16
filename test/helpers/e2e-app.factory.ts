import { INestApplication, ValidationPipe } from "@nestjs/common"
import { IGhibliGateway } from "src/users/domain/ports/in/ghibli.gateway";
import { App } from "supertest/types"
import { createGhibliGatewayMock } from "./ghibli.mock";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import { DI_TOKENS } from "src/users/application/di.tokens";

export type E2EAppContext = {
    app: INestApplication<App>
    ghibliMock: jest.Mocked<IGhibliGateway>
}

export async function createE2EApp(): Promise<E2EAppContext> {
    const ghibliMock = createGhibliGatewayMock()

    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule]
    })
      .overrideProvider(DI_TOKENS.GHIBLI_GATEWAY)
      .useValue(ghibliMock)
      .compile()

    const app = moduleFixture.createNestApplication()

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true
        })
    )

    await app.init()

    return { app, ghibliMock }
}