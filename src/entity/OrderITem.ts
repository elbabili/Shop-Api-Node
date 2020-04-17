import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from "typeorm";
import { Product } from "./Product";
import { Order } from "./Order";

@Entity('orderItems')
export class OrderItem {

    constructor(){        
    } 

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Product, product => product.orderItems)
    product : Product;

    @Column("int")
    quantity: number;

    @Column("double")
    price: number;

    @ManyToOne(type => Order, order => order.orderItems)
    order : Order; 
}