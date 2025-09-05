import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { EventModule } from './event/event.module';
import { config } from './config/database.config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SuperadminModule } from './superadmin/superadmin.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './common/mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        ({
          type: 'postgres',
          url: config.DB_URL,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: config.NODE_ENV !== 'production',
          ssl:
            config.NODE_ENV === 'production'
              ? { rejectUnauthorized: false }
              : false,
        }) as TypeOrmModuleOptions,
      inject: [ConfigService],
    }),
    MailModule,
    AuthModule,
    UserModule,
    AdminModule,
    EventModule,
    SuperadminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
