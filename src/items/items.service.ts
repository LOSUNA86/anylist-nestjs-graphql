import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';


@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository( Item )
    private readonly itemsRepository: Repository<Item>,

  ) {}

  async create( user: User,  createItemInput: CreateItemInput ): Promise<Item> {
    const newItem = this.itemsRepository.create( createItemInput )
    newItem.user = user;
    return await this.itemsRepository.save( newItem );
  }

  async findAll( user: User ): Promise<Item[]> {      
    return await this.itemsRepository.findBy({ user: user });    
  }

  async findOne( id: string, user: User ): Promise<Item> {

    const item = await this.itemsRepository.findOneBy({ id, user })
    if ( !item ) throw new NotFoundException(`Item with id: ${ id } not found`);
    return item;

  }

  async update(id: string, updateItemInput: UpdateItemInput, user: User): Promise<Item> {
    
    await this.findOne( id, user );
    const item = await this.itemsRepository.preload( updateItemInput );
    if ( !item ) throw new NotFoundException(`Item with id: ${ id } not found`);
    return this.itemsRepository.save( item );

  }

  async remove( id: string, user: User ):Promise<Item> {  

    const item = await this.findOne( id, user );
    await this.itemsRepository.remove( item );
    return { ...item, id };

  }

  async itemCountByUser( user: User ): Promise<number> {
    
    return await this.itemsRepository.count({
      where: { user : { id: user.id } }
    });

  }

}
