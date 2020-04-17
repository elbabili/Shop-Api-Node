import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from "typeorm";
import { Category } from "./Category";
import { OrderItem } from "./OrderITem";

@Entity('products')
export class Product {

     constructor(name,description,currentPrice,
                promotion,selected,available,
                quantity,photoName,category){
        this.name = name;
        this.description = description;
        this.currentPrice = currentPrice;
     
        this.promotion = promotion;
        this.selected = selected;
        this.available = available;

        this.quantity = quantity;
        this.photoName = photoName;
        this.category = category;
    } 

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;
    @Column('text')
    description: string;
    @Column("double")
    currentPrice: number;

    @Column("boolean")
    promotion: boolean;
    @Column("boolean")
    selected: boolean;
    @Column("boolean")
    available: boolean;

    @Column("int")
    quantity: number;
    @Column("text")
    photoName: string;

    @ManyToOne(type => Category, category => category.products)
    category: Category;

    @ManyToOne(type => OrderItem, orderItem => orderItem.product)
    orderItems : OrderItem[];

    toString(){ 
        return this.id + " " + this.name + " " + this.description + " " + this.currentPrice + " " + this.quantity;
    }
}