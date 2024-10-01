import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './passport/jwt.strategy';
import { SharedModule } from './shared/shared.module';
import { TenantEntityModule } from './tenant-entity/tenant-entity.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    TenantEntityModule,
    AuthModule,
    SharedModule,
    UserModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
