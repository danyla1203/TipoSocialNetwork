export interface SqlMaker {
    select: Function,
    delete: Function,
    update: Function,
    insert: Function
}