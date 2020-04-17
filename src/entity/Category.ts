import {Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn} from "typeorm";
import { Product } from "./Product";

@Entity('categories')
export class Category {

    constructor(name, description, products){
       this.name = name;
       this.description = description;
       this.products = products;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column("text")
    description: string;

    @OneToMany(type => Product, product => product.category) // note: we will create author property in the Photo class below
    products: Product[];
}