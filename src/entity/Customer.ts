import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany} from "typeorm";
import { OrderItem } from "./OrderITem";
import { Order } from "./Order";

@Entity('customers')
export class Customer {

    constructor(name,userName,email,address,phone){        
        this.name = name;
        this.userName = userName;
        this.email = email;
        this.address = address;
        this.phone = phone;
    } 

    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    name: string;

    @Column("text")
    userName: string;

    @Column("text")
    email: string;

    @Column("text")
    address: string;

    @Column("text")
    phone: string;

    @OneToMany(type => Order, order => order.customer)
    orders: Order[]; 
}