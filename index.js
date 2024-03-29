const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const res = require('express/lib/response');

app.use(cors());
app.use(express.json());
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dsvrj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    const productCollection = client.db("grocery_shop").collection("products");

    app.get('/inventory', async(req, res)=>{
      
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products)
   
    });

    app.post('/inventory', (req, res)=>{
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

    app.delete('/inventory/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id : ObjectId(id)};
      const result = await productCollection.deleteOne(query);
      res.send(result);
    })

    app.get('/myitem', async(req, res) =>{
      const userId = req.query.userId;
      const query = {userId : userId};
      const result = productCollection.find(query);
      const resultArray = await result.toArray();
      res.send(resultArray);
    })
    
    app.put('/update/:id', async(req, res) => {
      const id = req.params.id;
      const newQuantity = req.body;
      const filter = {_id: ObjectId(id)};
      const options ={upsert: true};
      const updatedDoc = {
        $set:{
          quantity: newQuantity.quantity,
        }
        
      };
      const updatedResult = await productCollection.updateOne(filter, updatedDoc, options);
      res.send(updatedResult);
    })

  }finally{}
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Working Successfully');
})
app.get('/herokuTest', (req, res) => {
  res.send('Working Successfully Heroku');
})

app.listen(port, () => {
  console.log(`Grocery Shop Running ${port}`)
})
