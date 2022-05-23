const express = require('express');
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config()
const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// middlewear
app.use(cors())
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.euupn.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// function verifyJWT(req, res, next) {
//     const authHeaders = req.headers.authorization
//     if (!authHeaders) {
//         return res.status(401).send({ message: 'unAuthorized access' })
//     }
//     const token = authHeaders.split(' ')[1];
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
//         if (err) {
//             return res.status(403).send({ message: 'Forbidden access' })
//         }
//         req.decoded = decoded;
//         next();
//     })

// }


async function run() {
    try {
        await client.connect()
        const CartsCollection = client.db('Car_Parts').collection('Parts')

        const reviewsCollection = client.db('Car_Parts').collection('reviews')

        const orderCollection = client.db('Car_Parts').collection('orders')

        const myprofileCollection = client.db('Car_Parts').collection('myProfile')

        const userCollection = client.db('Car_Parts').collection('users')

        const paymentCollection = client.db('Car_Parts').collection('payments')


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


        // /////// my profile inserted sectrion ///////////

        // ///  database e my info save kora ////////
        app.post('/myprofile', async (req, res) => {
            const newService = req.body;
            const result = await myprofileCollection.insertOne(newService);
            res.send(result);
        });

        // ///////// query by email for my profile ///////////

        app.get("/myprofile/:email", async (req, res) => {
            const email = req.params;
            const cursor = myprofileCollection.find(email)
            const products = await cursor.toArray()
            res.send(products)
        });

        // /////////// data update //////////
        app.put('/myprofile/:id', async (req, res) => {
            const id = req.params.id;
            const updatUser = req.body;
            const filter = { _id: ObjectId(id) }
            const option = { upsert: true };
            const updateDoc = {
                $set: {
                    education: updatUser.education,
                    city: updatUser.city,
                    phone: updatUser.phone

                }
            };
            const result = await myprofileCollection.updateOne(filter, updateDoc, option)
            res.send(result);
        });

        // ///////////// user er jnno /////////////////////

        app.get('/user', async (req, res) => {
            const users = await userCollection.find().toArray()
            res.send(users)
        })


        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body
            const filter = { email: email };
            const option = { upsert: true };
            const update = {
                $set: user,
            }
            const result = await userCollection.updateOne(filter, update, option)
            // token jenarete
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30d' })
            res.send({ result, token });
        });


        // ////payment section /////////////////////

        app.get('/part/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const booking = await paymentCollection.findOne(query)
            res.send(booking)
        })


        ///////////  admin section ////////////////// 

        app.get('/user', async (req, res) => {
            const users = await userCollection.find().toArray();
            res.send(users);
        });
        app.get('/admin/:email', async (req, res) => {
            const email = req.params.email;
            const user = await userCollection.findOne({ email: email });
            const isAdmin = user.role === 'admin';
            res.send({ admin: isAdmin })
        })
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);

            res.send({ result });
        });
        app.put('/user/admin/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const updateDoc = {
                $set: { role: 'admin' },
            };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);
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