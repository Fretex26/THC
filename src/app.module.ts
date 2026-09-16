import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { APP_FILTER } from '@nestjs/core';
import { DomainExceptionFilter } from './common/infrastructure/domain-exception.filter';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter
    }
  ],
})
export class AppModule {}
