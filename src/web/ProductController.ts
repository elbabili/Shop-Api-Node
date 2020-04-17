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
  async Get(@Params() id:number){
    const connection = await this.connection;
    let productRepository = connection.getRepository(Product);
    let product = await productRepository.findOne(id);    //ToDo : que se passe t il s'il n'est pas en base
    return product;    
  }

  @Get("/products")
  async getAll(@Req() request: any, @Res() response: any) {
    const connection = await this.connection;
    let productRepository = connection.getRepository(Product);
    return productRepository.find();
  }

  @Get("/selectedProducts")
  async getSelectedProducts(@Req() request: any, @Res() response: any) {
    const connection = await this.connection;
    const products = await connection.getRepository(Product)
    .createQueryBuilder("product")
    .where("product.selected = :flag", { flag: true })
    .getMany();  
    return products;
  }

  @Get("/promotionProducts")
  async getPromotionProducts(@Req() request: any, @Res() response: any) {
    const connection = await this.connection;
    const products = await connection.getRepository(Product)
    .createQueryBuilder("product")
    .where("product.promotion = :flag", { flag: true })
    .getMany();  
    return products;
  }

  @Get("/availableProducts")
  async getAvailableProducts(@Req() request: any, @Res() response: any) {
    const connection = await this.connection;
    const products = await connection.getRepository(Product)
    .createQueryBuilder("product")
    .where("product.available = :flag", { flag: true })
    .getMany();  
    return products;
  }

  @Post("/product")
  async post(@Body() body: any) {   //ToDO : test si tous les param ne sont présent dans body ?
    const product = new Product(body.name,body.description,body.currentPrice,
                                body.promotion,body.selected,body.available,
                                body.quantity,body.photoName,body.category);    //ToDo null : category
    const connection = await this.connection;
    let categoryRepository = connection.getRepository(Category);    
    let category = await categoryRepository.findOne(body.category.id); // Recup category à partir de son id

    product.category = category;
    let productRepository = connection.getRepository(Product);
    await productRepository.save(product);
    return product;
  }

  @Put("/product/:id")    // ToDO : tester @Body() product : Product
                          // ToDo : trouver un moyen pour mettre à jour uniquement les champs changés
  async put(@Body() body: any, @Params()id:number){
    const connection = await this.connection;
    let productRepository = connection.getRepository(Product);

    let newProduct = await productRepository.findOne(id);
    newProduct.name = body.name;
    newProduct.description = body.description;
    newProduct.currentPrice = body.currentPrice;

    newProduct.promotion = body.promotion;
    newProduct.selected = body.selected;
    newProduct.available = body.available;

    newProduct.photoName = body.photoName;
    newProduct.quantity = body.quantity;
    newProduct.category = body.category;

    await productRepository.save(newProduct);
    return newProduct;   
  }

  @Delete("/product/:id")
  async delete(@Params() id:number){
    const connection = await this.connection;
    let productRepository = connection.getRepository(Product);
    let product = await productRepository.delete(id);
    return product;    
  }

  //Affichage d'une photo côté front : ToTo -> comment optimiser le rafraichissement d'une page sans avoir à envoyer sythématiquement une photo / AJAX !
  @Get("/photoProduct/:id")  
  async getPhoto(@Req() request: any, @Res() response: any, @Params() id:number){
    const connection = await this.connection;
    let productRepository = connection.getRepository(Product);
    let product = await productRepository.findOne(id);    
    let image = fs.readFileSync(process.env['HOME'] + "/ecom/products/" + product.photoName);    
    response.type = 'image/png | image/jpeg';
    response.body = image;
    return response;
  }

  //Récupération d'une photo côté front pour l'ajouter dans le rep dédié côté back
  @Post("/uploadPhoto/:id")  
  async uploadPhoto(@UploadedFile("file") file: any, @Params() id:number){
    const connection = await this.connection;
    let productRepository = connection.getRepository(Product);    
    let product = await productRepository.findOne(id); 
    console.log(file);
    fs.writeFileSync(process.env['HOME'] + "/ecom/products/" + file.originalname,file.buffer); //ToDo si fichier existe
    product.photoName = file.originalname;
    productRepository.save(product);
    //ToDO return une requete de confirmation de la modif
    return '200';
  }  

  @Get("/generate")
  async generate(){
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

    const dupont = new Customer("dupont","dup","dupont@gmail.com","2 chemin gris", "0616325421");
    let customerRepository = connection.getRepository(Customer);
    await customerRepository.save(dupont);

    return "ok";
  }
   
}