const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
const cors = require("cors");
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.i3qcq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        // const database = client.db("foodMaster");
        const database = client.db("SunglassProject");
        const productCollection = database.collection("products");
        const reviewCollection = database.collection("review");
        const ordersCollection = database.collection("orders");
        const adminsCollection = database.collection("admins");

        //GET API Users
        app.get('/product', async (req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        })
        //GET API Travellers
        // app.get('/Travellers', async (req, res) => {
        //     const cursor = travellersCollection.find({});
        //     const users = await cursor.toArray();
        //     res.send(users);
        // })
        //GET API Orders
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })
        //GET API Orders
        app.get('/review', async (req, res) => {
            const cursor = reviewCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })


        // UNIQUE ID
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await productCollection.findOne(query);
            console.log('load user with id', id);
            res.send(user);
        })

        // UNIQUE ID order
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await ordersCollection.findOne(query);
            console.log('load user with id', id);
            res.send(user);
        })

        // POST API add services
        app.post('/product', async (req, res) => {
            const newUser = req.body;
            const result = await productCollection.insertOne(newUser);
            console.log('Added User', result);
            res.json(result);
        })

        //GET API Admin
        app.post('/admin', async (req, res) => {
            const email = req.body.email;
            const cursor = adminsCollection.find({ email: email }).toArray((err, admin) => { res.send(admin.length > 0) })
            // const users = await cursor.toArray();
            // res.send(users);
        })

        // POST API add Admin
        app.post('/addAdmin', async (req, res) => {
            const newUser = req.body;
            const result = await adminsCollection.insertOne(newUser);
            console.log('Added User', result);
            res.json(result);
        })

        // POST API add Orders
        app.post('/orders', async (req, res) => {
            const newUser = req.body;
            const result = await ordersCollection.insertOne(newUser);
            res.json(result);
        })
        // POST API add Review
        app.post('/review', async (req, res) => {
            const newReview = req.body;
            const result = await reviewCollection.insertOne(newReview);
            res.json(result);
        })

        // UPDATE API Approved
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const updateUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    address: updateUser.address,
                    mobileNo: updateUser.mobileNo,
                    description: updateUser.description,
                    name: updateUser.name,
                    email: updateUser.email,
                    img: updateUser.img,
                    price: updateUser.price,
                    product_id: updateUser.product_id,
                    status: updateUser.status
                },
            };
            const result = await ordersCollection.updateOne(filter, updateDoc, options)
            console.log('Updating user', id)
            res.json(result);
        })

        // DELETE API Orders
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            console.log('delete user with id', id);
            res.json(result);
        })
        // DELETE API Products
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            console.log('delete user with id', id);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running My CURD Server');
})
app.listen(port, () => {
    console.log('Running server on port', port);
})