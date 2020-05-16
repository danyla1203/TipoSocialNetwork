class Model {
    constructor(connection, sqlMaker) {
        this.pool = connection;
        this.sqlMaker = sqlMaker;
    }
}
module.exports = Model;