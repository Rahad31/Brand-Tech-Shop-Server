const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// midleware
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.64k1q4w.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCollection = client.db("productDB").collection("product");
    const mycartCollection = client.db("mycartDB").collection("mycart");
    app.get("/product", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    app.post("/product", async (req, res) => {
      const productdetail = req.body;
      console.log(productdetail);
      const result = await productCollection.insertOne(productdetail);
      res.send(result);
    });

    // for my cart
    app.post("/mycarts", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await mycartCollection.insertOne(newProduct);
      res.send(result);
    });
    app.get("/mycarts", async (req, res) => {
      const cursor = mycartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/mycarts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await mycartCollection.findOne(query);
      res.send(result);
    });

    app.delete("/mycarts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await mycartCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/product/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const upProduct = req.body;
      const Product = {
        $set: {
          image: upProduct.image,
          name: upProduct.name,
          brand: upProduct.brand,
          type: upProduct.type,
          price: upProduct.price,
          description: upProduct.description,
          rating: upProduct.rating,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        Product,
        options
      );
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Coffie");
});

app.listen(port, () => {});
