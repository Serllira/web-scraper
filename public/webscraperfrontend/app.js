const MongoClient = require("mongodb").MongoClient;
const ObjectId = require('mongodb').ObjectID;
const uri = "mongodb+srv://admin:admin@lekercluster-4rwlk.mongodb.net/test?retryWrites=true&w=majority";
const dbName = 'myproject';
let database;

class MongoDbClient {

    async connect() {
        const connection = await MongoClient.connect(uri).then(function (client) {
            database = client.db(dbName);
            console.log('Connected!')
        }).catch(function (err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n', err);
        })
    }

    async addResults(collection, results) {
        const collect = database.collection(collection);
        try {
            await collect.insertMany(results);
            //console.log("Se ha insertado correctamente");
        } catch (e) {
            console.log("Ha ocurrido un error al insertar: ", e)
        }
    }

    async getAllResults(collection) {
        const collect = database.collection(collection);
        try {
            let res = await collect.find({}).toArray();
            //console.log("Mostrando todos los resultados", res);
            return res;
        } catch (e) {
            console.log("Ha ocurrido un error al mostrar todos los resultados")
        }
    }

    async getResultById(collection, id) {
        const collect = database.collection(collection);
        try {
            let res = await collect.findOne({_id: new ObjectId(id)});
            //console.log("Mostrando todos los resultados del id", res);
            return res;
        } catch (e) {
            console.log("Ha ocurrido un error al mostrar los resultados del id")
        }
    }

    async getResultBySearch(collection, search) {
        const collect = database.collection(collection);
        try {
            collect.createIndex({nombre: "text"});
            let res = await collect.find({nombre: {$regex: ".*" + search + ".*", $options: "$i"}}).toArray();
            //console.log("Mostrando todos los resultados del nombre "+search, res);
            return res;
        } catch (e) {
            console.log("Ha ocurrido un error al mostrar los resultados del nombre", e.message)
        }
    }

    async close() {
        return await database.close();
    }
}

module.exports = MongoDbClient;