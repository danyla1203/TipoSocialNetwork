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

function insert(tableName) {
    let sql = `INSERT INTO ${tableName}`;

    return {
        sql: sql,
        set: setForInsert
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
