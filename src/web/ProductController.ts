import {Body, Controller, Get, Post, Delete, Put, Req, Res, Params, UploadedFile} from 'routing-controllers';
import {Product} from "../entity/Product";
import {Category} from "../entity/Category";
import {Connection} from 'typeorm/connection/Connection';

import {Connect} from "../bdd/Connect";

import * as fs from 'fs';
import { Customer } from '../entity/Customer';
import { Order } from '../entity/Order';
import { OrderItem } from '../entity/OrderITem';

@Controller()
export class ProductController {

  connection: Promise<Connection>;

  constructor() {
    // generates a connection using `ormconfig.json`
    this.connection = Connect.getConnect();
  }

  @Get("/products/:id")          
  async Get(@Params() id:number, @Req() request: any, @Res() response: any){
    try {
      const connection = await this.connection;
      let productRepository = connection.getRepository(Product);
      let product = await productRepository.findOne(id);
      if(product)    return product;    
      else {
        response.status = 404;      // ToDo à finir la gestion des codes erreu
        response.message = "product not found in database";
        return response;
      }
    }
    catch(Error){
      console.log(Error.message);
      return Error.message;
    }
  }

  @Get("/products")
  async getAll() {
    try {
      const connection = await this.connection;
      let productRepository = connection.getRepository(Product);
      if(productRepository)   return productRepository.find();
      else return "database empty";
    }
    catch(Error){
      console.log(Error.message);
      return Error.message;
    }
  }

  @Get("/selectedProducts")
  async getSelectedProducts() {
    try {
      const connection = await this.connection;
      const products = await connection.getRepository(Product)
      .createQueryBuilder("product")
      .where("product.selected = :flag", { flag: true })
      .getMany(); 
      if(products)    return products;
      else return "No products with option selected in database";
    }
    catch(Error){
      console.log(Error.message);
      return Error.message;
    }
  }

  @Get("/promotionProducts")
  async getPromotionProducts() {
    try {
      const connection = await this.connection;
      const products = await connection.getRepository(Product)
      .createQueryBuilder("product")
      .where("product.promotion = :flag", { flag: true })
      .getMany();  
      if(products)    return products;
      else return "No products with option promotion in database";
    }
    catch(Error){
      console.log(Error.message);
      return Error.message;
    }
  }

  @Get("/availableProducts")
  async getAvailableProducts() {
    try{
      const connection = await this.connection;
      const products = await connection.getRepository(Product)
      .createQueryBuilder("product")
      .where("product.available = :flag", { flag: true })
      .getMany();  
      if(products)    return products;
      else return "No products with option available in database";
    }
    catch(Error){
      console.log(Error.message);
      return Error.message;
    }
  }

  @Post("/products")
  async post(@Body() body: any) {   
    try {
      const product = new Product(body.name,body.description,body.currentPrice,
                                  body.promotion,body.selected,body.available,
                                  body.quantity,body.photoName,body.category);    //ToDo null : category
      const connection = await this.connection;
      let categoryRepository = connection.getRepository(Category);    
      if(body.category){
        let category = await categoryRepository.findOne(body.category.id); // Recup category à partir de son id
        product.category = category;
      }
      else product.category = null;
      let productRepository = connection.getRepository(Product);
      let ok = await productRepository.save(product);
      if(ok)   return product;
      else return "Impossible to post product";
    }
    catch(Error){
      console.log(Error.message);
      return Error.message;
    }
  }

  @Put("/products/:id")    
  async put(@Body() body: any, @Params()id:number){
    try{
      const connection = await this.connection;
      let productRepository = connection.getRepository(Product);

      let newProduct = await productRepository.findOne(id);
      if(!newProduct) return "this product doesnt exist";
      newProduct.name = body.name;
      newProduct.description = body.description;
      newProduct.currentPrice = body.currentPrice;

      newProduct.promotion = body.promotion;
      newProduct.selected = body.selected;
      newProduct.available = body.available;

      newProduct.photoName = body.photoName;
      newProduct.quantity = body.quantity;
      newProduct.category = body.category;

      let ok = await productRepository.save(newProduct);
      if(ok)  return newProduct;   
      else return "impossible to update this data in database";
    }
    catch(Error){
      console.log(Error.message);
      return Error.message;
    }
  }

  @Delete("/products/:id")
  async delete(@Params() id:number){
    try {
      const connection = await this.connection;
      let productRepository = connection.getRepository(Product);
      let ok = await productRepository.delete(id);
      
      if(ok.affected == 1) return "product deleted";    
      else return "not found this product in db";
    }
    catch(Error){
      console.log(Error.message);
      return Error.message;
    }
  }

  //Affichage d'une photo côté front
  @Get("/photoProduct/:id")  
  async getPhoto(@Req() request: any, @Res() response: any, @Params() id:number){
    try{
      const connection = await this.connection;
      let productRepository = connection.getRepository(Product);
      let product = await productRepository.findOne(id);    
      let image = fs.readFileSync(process.env['HOME'] + "/ecom/products/" + product.photoName);    
      response.type = 'image/png | image/jpeg';
      response.body = image;
      return response;
    }
    catch(Error){
      console.log(Error.message);
      return Error.message;
    }
  }

  //Récupération d'une photo côté front pour l'ajouter dans le rep dédié côté back
  @Post("/uploadPhoto/:id")  
  async uploadPhoto(@UploadedFile("file") file: any, @Params() id:number){
    try {
      const connection = await this.connection;
      let productRepository = connection.getRepository(Product);    
      let product = await productRepository.findOne(id); 
      if(product) {
        fs.writeFileSync(process.env['HOME'] + "/ecom/products/" + file.originalname,file.buffer); //ToDo si fichier existe
        //sous entend que les reps ecom et products existent ToDO prévoir leur création avec injection de la photo par défaut
        product.photoName = file.originalname;
        let ok = productRepository.save(product);
        if(ok)  return "upload ok";
        else return "pb with update product/photo";
      }
    }
    catch(Error){
      console.log(Error.message);
      return Error.message;
    }    
  }  

  @Post("/generate")
  async generate(){   // TODO si base de donné vide alors valider la génération des datas + ajouter sécurité ici ou désactiver... 
    const connection = await this.connection;    
    //ajout de catégories
    const smartphone = new Category("SmartPhone","Tel mobile",null);    
    const laptop = new Category("LapTop","pc portbale & fixe",null);    
    const tablet = new Category("Tablet","Tablet Graphique",null);    
    let categoryRepository = connection.getRepository(Category);
    await categoryRepository.save(smartphone);  
    await categoryRepository.save(laptop);  
    await categoryRepository.save(tablet);    

    //ajout de produits
    const s8 = new Product("s8","samsung s8",250,true,true,true,0,'unknown.png',smartphone);
    const s9 = new Product("s9","samsung s9",300,true,true,true,0,'unknown.png',smartphone);
    const iphone = new Product("iphone","iphone x",250,true,true,true,0,'unknown.png',smartphone);
    let productRepository = connection.getRepository(Product);
    await productRepository.save(s8);  
    await productRepository.save(s9); 
    await productRepository.save(iphone); 

    const pc1 = new Product("pc1","dell",350,true,true,true,0,'unknown.png',laptop);
    const pc2 = new Product("pc2","sony",450,true,true,true,0,'unknown.png',laptop);
    await productRepository.save(pc1);  
    await productRepository.save(pc2);

    const tab = new Product("tablet","samsung galaxy",250,true,true,true,0,'unknown.png',tablet);
    await productRepository.save(tab);  

    //Ajout d'un client
    const dupont = new Customer("dupont","dup","dupont@gmail.com","2 chemin gris", "0616325421");
    let customerRepository = connection.getRepository(Customer);
    await customerRepository.save(dupont);

    return "Generate data in database ok";    
  }   
}