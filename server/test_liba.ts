import { Injectable } from "@nestjs/common";

@Injectable()
export class SqlMaker {
    where(expression: string) {
        let returnSql = `${this.sql} WHERE ${expression}`;
        return returnSql;
    }
    
    on(values: string) {
        let returnSql = `${this.sql} ON ${values}`;
        return {
            toString: () => { return returnSql; },
            sql: returnSql,
            where: this.where,
            join: this.join
        };
    }
    
    join(table: string) {
        let sql = this.sql;
        sql = `${sql} JOIN ${table}`;
        return {
            sql: sql,
            on: this.on
        };
    }
    
    leftJoinSql(table: string) {
        let sql = this.sql;
        sql = `${sql} LEFT JOIN ${table}`;
        return {
            sql: sql,
            on: this.on
        };
    }
    
    select(params: string) {
        let paramsInsert = "";
    
        if(!params) {
            paramsInsert += "* ";
        } else {
            for (let i = 0; i < params.length; i++) {
                if (i == params.length - 1) {
                    paramsInsert += `${params[i]} `;
                } else {
                    paramsInsert += `${params[i]}, `;
                }
            }
        }
    
        let sql = `SELECT ${paramsInsert}`;
                
        return {
            sql: sql,
            from: this.from
        };
    }
    
    setForUpdate(valuesObj) {
        let sql = `${this.sql} SET`;
    
        let count = 0;
        let length = Object.keys(valuesObj).length;
        for (let column in valuesObj) {
            count++;
            if (count == length) {
                sql += ` ${column} = "${valuesObj[column]}" `;
                break;
            }
            sql += ` ${column} = "${valuesObj[column]}",`;
    
        }
    
        return {
            sql: sql,
            where: this.where
        };
    }
    
    update(table: string) {
        let sql = `UPDATE ${table}`;
        return {
            sql: sql,
            set: this.setForUpdate
        };
    }
    
    deleteItem(tableName: string) {
        let sql = `DELETE FROM ${tableName}`;
    
        return {
            sql: sql,
            where: this.where
        };
    }
    
    
    setForInsert(valuesObj) {
        let columns = "";
        let values = "";
    
        let counter = 0;
        let length = Object.keys(valuesObj).length;
    
        for (let column in valuesObj) {
            counter++;
            if (counter == length) {
                if (typeof valuesObj[column] == "string") {
                    values += `"${valuesObj[column]}"`;
                } else {
                    values += `${valuesObj[column]}`;
                }
                columns += `${column}`;
                break;
            }
    
            if (typeof valuesObj[column] == "string") {
                values += `"${valuesObj[column]}", `;
            } else {
                values += `${valuesObj[column]}, `;
            }
    
            columns += `${column}, `;
        }
        let sql = `${this.sql} (${columns}) VALUES( ${values}) `;
        return sql;
    }
    
    setMany(objArray) {
        let columns = "(";
        let props = Object.keys(objArray[0]);
        for (let column = 0; column < props.length; column++) {
            if (column == 0) {
                columns += `${props[column]}`;    
            } else {
                columns += `, ${props[column]}`;
            }
        }
    
        let allSql = `${columns}) VALUES`;
        for (let i = 0; i < objArray.length; i++) {
            let value = "(";
            for (let field in objArray[i]) {
                if (typeof objArray[i][field] == "string") {
                    value = `${value}, "${objArray[i][field]}"`;
                } else {
                    value = `${value} ${objArray[i][field]}`;
                }
            }
            if (i == objArray.length - 1) {
                value = `${value})`;
            } else {
                value = `${value}), `;
            }
            allSql = allSql + value;
        }
        return `${this.sql} ${allSql}`;
    }
    
    insert(tableName: string) {
        let sql = `INSERT INTO ${tableName}`;
    
        return {
            sql: sql,
            set: this.setForInsert,
            setMany: this.setMany
        };
    }
    from(tbName: string) {
        console.log(this);
        let returnSql = `${this.sql}FROM ${tbName}`;
        return {
            toString: () => { return this.sql; },
            sql: returnSql,
            join: this.join,
            leftJoin: this.leftJoinSql,
            where: this.where
        };
    }
}
