import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
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
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () =>
        ({
          type: 'postgres',
          url: config.DB_URL.replace('postgresql://', 'postgres://'), // ✅ Render fix
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true, // ✅ jadvalni avtomatik yaratadi (faqat dev/prod boshida)
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
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
