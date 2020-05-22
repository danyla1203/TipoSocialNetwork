function where(expression) {
    let returnSql = `${this.sql} WHERE ${expression}`;
    return returnSql;
}

function on(values) {
    let returnSql = `${this.sql} ON ${values}`;
    return {
        toString: () => { return returnSql },
        sql: returnSql,
        where: where,
        join: join
    }
}

function join(table) {
    let sql = this.sql;
    sql = `${sql} JOIN ${table}`;
    return {
        sql: sql,
        on: on
    }
}

function from(tbName) {
    let returnSql = `${this.sql}FROM ${tbName}`;
    return {
        toString: () => { return this.sql },
        sql: returnSql,
        join: join,
        where: where
    }
}

function select(params) {
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
        from: from
    }
}

function setForUpdate(valuesObj) {
    let sql = `${this.sql} SET`;

    let count = 0;
    let length = Object.keys(valuesObj).length;
    for (let column in valuesObj) {
        count++
        if (count == length) {
            sql += ` ${column} = "${valuesObj[column]}" `;
            break;
        }
        sql += ` ${column} = "${valuesObj[column]}",`;

    }

    return {
        sql: sql,
        where: where
    }
}

function update(table) {
    let sql = `UPDATE ${table}`;
    return {
        sql: sql,
        set: setForUpdate
    }
}

function deleteItem(tableName) {
    let sql = `DELETE FROM ${tableName}`;

    return {
        sql: sql,
        where: where
    }
}

function setForInsert(valuesObj) {
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

function setMany(objArray) {

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

function insert(tableName) {
    let sql = `INSERT INTO ${tableName}`;

    return {
        sql: sql,
        set: setForInsert,
        setMany: setMany
    }
}

function createDb() {
    return {
        insert: insert,
        select: select,
        update: update,
        delete: deleteItem
    }
}

module.exports.createDb = createDb;
