import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';

@Module({
  providers: [ UsersResolver, UsersService  ],
  imports: [ 
    TypeOrmModule.forFeature([ User ])
  ],
  exports: [ UsersService ]
})
export class UsersModule {}
