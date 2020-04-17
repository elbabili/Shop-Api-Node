import {Body, Controller, Get, Post, Delete, Put, Req, Res, Params} from 'routing-controllers';
import {Category} from "../entity/Category";
import {Connection} from 'typeorm/connection/Connection';

import {Connect} from "../bdd/Connect";

@Controller()
export class CategoryController {

  connection: Promise<Connection>;

  constructor() {
    // generates a connection using `ormconfig.json`
    this.connection = Connect.getConnect();
    //this.connection = createConnection();
  }

  @Get("/categories/:id")          
  async Get(@Params() id:number){
    const connection = await this.connection;
    let categoryRepository = connection.getRepository(Category);
    let category = await categoryRepository.findOne(id);    //ToDo : que se passe t il s'il n'est pas en base
    return category;    
  }

  @Get("/categories/:id/products")          
  async getProductsByCat(@Params() id:number){
    const connection = await this.connection;
    let products = await connection.createQueryBuilder()
                  .relation(Category, "products")
                  .of(id) 
                  .loadMany();
    return products;
  }

  @Get("/categories")
  async getAll(@Req() request: any, @Res() response: any) {
    const connection = await this.connection;
    let categoryRepository = connection.getRepository(Category);
    return categoryRepository.find();
  }

  @Post("/category")
  async post(@Body() body: any) {   //ToDO : test si tous les param ne sont présent dans body ?
    const category = new Category(body.name,body.description,body.products);    
    const connection = await this.connection;
    let categoryRepository = connection.getRepository(Category);
    await categoryRepository.save(category);
    return category;
  }

  @Put("/category/:id")
  async put(@Body() body: any, @Params()id:number){
    const connection = await this.connection;
    let categoryRepository = connection.getRepository(Category);

    let newCategory = await categoryRepository.findOne(body.id);
    newCategory.name = body.name;
    newCategory.description= body.description;    

    await categoryRepository.save(newCategory);
    return newCategory;   
  }

  @Delete("/category/:id")
  async delete(@Params() id:number){
    const connection = await this.connection;
    let categoryRepository = connection.getRepository(Category);
    let category = await categoryRepository.delete(id);
    return category;    
  }
}