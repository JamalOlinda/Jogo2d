class Database{
    constructor() {
        if(!Database.instance){
            Database.instance = this
        }
        return Database.instance
    }
}

const db1 = new Database()
const db2 = new Database()
console.log(db1 === db2)