import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import { Order } from "./Order";

@Entity('payments')
export class Payment {

    constructor(){        
    } 

    @PrimaryGeneratedColumn()
    id: number;

    @Column('date')
    date: Date;

    @Column('int')
    card: number;

    @Column('text')
    type: string;

    @OneToOne(type => Order)
    order : Order;
}