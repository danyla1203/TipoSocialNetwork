import { Connection } from "mysql";
import { SqlMaker } from "../types/sqlMaker";

export interface ModelType {
    pool: Connection
    sqlMaker: SqlMaker
}

export class Model implements ModelType{
    pool: Connection;
    sqlMaker: SqlMaker;
    constructor(connection: Connection, sqlMaker: SqlMaker) {
        this.pool = connection;
        this.sqlMaker = sqlMaker;
    }
}