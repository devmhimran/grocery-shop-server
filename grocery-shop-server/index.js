const express = require('express')
const app = express()
const port = 5000
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const res = require('express/lib/response');

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dsvrj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    await client.connect();
    const productCollection = client.db("grocery_shop").collection("products");

    app.get('/products', async(req, res)=>{
      
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products)
   
    });

    app.post('/products', (req, res)=>{
      const addProduct =  req.body;
      const result = productCollection.insertOne(addProduct);
      res.send(result);
    })

    app.get('/inventory/:id',async (req, res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const singleProduct = await productCollection.findOne(query);
      res.send(singleProduct);
    })
  
  }finally{}
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Working Successfully');
})

app.listen(port, () => {
  console.log(`Grocery Shop Running ${port}`)
})