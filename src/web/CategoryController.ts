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
    try {
      const connection = await this.connection;
      let categoryRepository = connection.getRepository(Category);
      let category = await categoryRepository.findOne(id);
      if(category)    return category;    
      else return "category not in db";
    }
    catch(Error){
      console.log(Error.message);
      return Error.message;
    }
  }

  @Get("/categories/:id/products")          
  async getProductsByCat(@Params() id:number){
    try {
      const connection = await this.connection;
      let products = await connection.createQueryBuilder()
                    .relation(Category, "products")
                    .of(id) 
                    .loadMany();
      if(products)    return products;
      else return "products of this category not in db";
    }
    catch(Error){
      console.log(Error.message);
      return Error.message;
    }
  }

  @Get("/categories")
  async getAll(@Req() request: any, @Res() response: any) {
    try {
      const connection = await this.connection;
      let categoryRepository = connection.getRepository(Category);
      let categories = categoryRepository.find();
      if(categories)  return categories;
      else return "table of categories empty in db";
    }
    catch(Error){
      console.log(Error.message);
      return Error.message;
    }
  }
/*
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
  }*/
}