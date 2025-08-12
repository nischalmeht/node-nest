import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post/entities/post.entities';
// import { ConfigModule } from '@nestjs/config'; 
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entities';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//     }),
//     // ConfigModule.forRoot({ isGlobal: true }), // ✅ Loads .env into process.env
//     // TypeOrmModule.forRoot({
//     //   type: 'postgres',
//     //   url: process.env.DATABASE_URL, // ✅ Ensure this exists in .env
//     //   autoLoadEntities: true,        // ✅ Automatically load all entities
//     //   synchronize: true,             // ⚠️ Disable in production
//     //   ssl: {
//     //     rejectUnauthorized: false,   // ✅ Required for Neon
//     //   },
//     //   extra: {
//     //     ssl: {
//     //       rejectUnauthorized: false,
//     //     },
//     //   },
//     // }),
//     // TypeOrmModule.forRoot({
//     //   type: 'postgres',
//     //   url: process.env.DATABASE_URL,
//     //   autoLoadEntities: true,
//     //   synchronize: true,
//     //   ssl: true,
//     //   extra: {
//     //     ssl: {
//     //       rejectUnauthorized: false,
//     //     },
//     //   },
//     // }),
//     // TypeOrmModule.forRootAsync({
//     //   useFactory: () => ({
//     //     type: 'postgres',
//     //     url: process.env.DATABASE_URL,
//     //     ssl: { rejectUnauthorized: false },
//     //     entities: [Post,User],
//     //     synchronize: true,
//     //   }),
//     // }),
//     // Keep DB config in Auth/Post modules; remove per-feature setup from AppModule
//     PostModule,
//     AuthModule,
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 5,
      },
    ]),

    CacheModule.register({
      isGlobal: true,
      ttl: 30000,
      max: 100,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, // Neon connection string
      autoLoadEntities: true,        // Loads all entities automatically
      synchronize: true,             // ⚠️ Turn off in prod
      ssl: {
        rejectUnauthorized: false,   // Required for Neon
      },
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),
    PostModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
// export class AppModule {}
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //apply the middleware for all the routes
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
// export class AppModule {}
