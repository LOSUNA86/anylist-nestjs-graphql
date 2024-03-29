import { Args, ID, Int, Mutation, Parent, Query, Resolver, ResolveField } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";
import { ValidRolesArgs } from "./dto/args/roles.arg";
import { ParseUUIDPipe, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { ValidRoles } from "src/auth/enums/valid-roles.enum";
import { UpdateUserInput } from "./dto/update-user.input";
import { ItemsService } from "src/items/items.service";

@Resolver(() => User)
@UseGuards( JwtAuthGuard )
export class UsersResolver {

  constructor( 
      private readonly usersService: UsersService,
      private readonly itemsService: ItemsService ) {}

  @Query(() => [User], { name: 'users' })
  async findAll(
    @Args() validRoles: ValidRolesArgs,
    @CurrentUser( [ValidRoles.admin, ValidRoles.superUser ] ) user: User
  ):Promise<User[]> { 

      return await this.usersService.findAll( validRoles.roles );   

  }

  @Query(() => User, { name: 'user' })
  async findOne( 
    @Args('id', { type: () => ID }, ParseUUIDPipe ) id: string,
    @CurrentUser( [ValidRoles.admin, ValidRoles.superUser ] ) user: User
  ): Promise<User> {
    
    return this.usersService.findOneById(id);
    
  }

  @Mutation(() => User, { name: 'updateUser' })
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser( [ValidRoles.admin ] ) user: User
  ): Promise<User> {

    return this.usersService.update( updateUserInput.id, updateUserInput, user );

  }

  @Mutation(() => User, { name: 'blockUser' })
  async blockUser( 
    @Args('id', { type: () => ID }, ParseUUIDPipe ) id: string,
    @CurrentUser([ ValidRoles.admin, ValidRoles.superUser ]) user: User
  ): Promise<User> {

    return this.usersService.block(id, user );

  }

  @ResolveField( () => Int, { name: 'itemCount' })
  async itemCount(
    @CurrentUser([ ValidRoles.admin ]) adminUser: User,
    @Parent() user: User
  ): Promise<number> {
    
    return this.itemsService.itemCountByUser( user );
    
  }
  
}