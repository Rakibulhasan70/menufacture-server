const express = require('express');
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// middlewear
app.use(cors())
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.euupn.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const CartsCollection = client.db('Car_Parts').collection('Parts')

        const reviewsCollection = client.db('Car_Parts').collection('reviews')
        const orderCollection = client.db('Car_Parts').collection('orders')


        // get all data 
        app.get('/part', async (req, res) => {
            const query = {}
            const cursor = CartsCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        });

        //  get single data
        app.get('/part/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await CartsCollection.findOne(query);
            res.send(result)
        });

        // update

        app.put('/part/:id', async (req, res) => {
            const id = req.params.id;
            const updatUser = req.body;
            const filter = { _id: ObjectId(id) }
            const option = { upsert: true };
            const updateDoc = {
                $set: {
                    order: updatUser.order,
                    img: updatUser.img,
                    description: updatUser.description,
                    availableOrder: updatUser.availableOrder,
                    price: updatUser.price,
                    name: updatUser.name

                }
            };
            const result = await CartsCollection.updateOne(filter, updateDoc, option)
            res.send(result);
        });

        // review item get
        app.get('/review', async (req, res) => {
            const query = {}
            const cursor = reviewsCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        });

        // insert review
        app.post('/review', async (req, res) => {
            const newProduct = req.body
            console.log(newProduct);
            const result = await reviewsCollection.insertOne(newProduct)
            res.send(result)
        })

        // my order section

        // get add all product
        app.get('/addItem', async (req, res) => {
            const query = {}
            const cursor = orderCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        });

        // insert new product
        app.post('/addItem', async (req, res) => {
            const newService = req.body;
            const result = await orderCollection.insertOne(newService);
            res.send(result);
        });

        // query by email
        app.get("/myorder/:email", async (req, res) => {
            const email = req.params;
            const cursor = orderCollection.find(email)
            const products = await cursor.toArray()
            res.send(products)
        });

        // delete part

        app.delete('/myorder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query)
            res.send(result)
        })

    }
    finally {

    }
}

run().catch(console.dir())


app.get('/', (req, res) => {
    res.send('assignment 12 is on fire')
})

app.listen(port, () => {
    console.log(`Doctors app listening on port ${port}`);
})