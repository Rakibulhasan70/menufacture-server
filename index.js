const express = require('express');
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');


// middlewear
app.use(cors())
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.euupn.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {


    }
    finally {

    }
}

run().catch(console.dir())


app.get('/', (req, res) => {
    res.send('assignment 12 is fire')
})

app.listen(port, () => {
    console.log(`Doctors app listening on port ${port}`);
})