import {createConnection} from 'typeorm';
import {Connection} from 'typeorm/connection/Connection';

export class Connect{
    static connection: Promise<Connection> = null;

    static getConnect(){
        if(this.connection == null) this.connection = createConnection(); 
        return this.connection;
    }
}