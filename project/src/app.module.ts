import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post/entities/post.entities';
// import { ConfigModule } from '@nestjs/config'; 
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // ConfigModule.forRoot({ isGlobal: true }), // ✅ Loads .env into process.env
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   url: process.env.DATABASE_URL, // ✅ Ensure this exists in .env
    //   autoLoadEntities: true,        // ✅ Automatically load all entities
    //   synchronize: true,             // ⚠️ Disable in production
    //   ssl: {
    //     rejectUnauthorized: false,   // ✅ Required for Neon
    //   },
    //   extra: {
    //     ssl: {
    //       rejectUnauthorized: false,
    //     },
    //   },
    // }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   url: process.env.DATABASE_URL,
    //   autoLoadEntities: true,
    //   synchronize: true,
    //   ssl: true,
    //   extra: {
    //     ssl: {
    //       rejectUnauthorized: false,
    //     },
    //   },
    // }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        entities: [Post,User],
        synchronize: true,
      }),
    }),
    PostModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
