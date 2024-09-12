// 
// rimanroni386

const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv'); 
dotenv.config()
const port =  4000;
 
//  middle ware 
app.use(cors());
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://rimanroni386:AB1SuIBQShR1EPG0@cluster0.s4q80.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const servicesCollection = client.db("servicesDB").collection("servicesCollection");
    const productCollection = client.db("productDB").collection('productCollection')
    const ordersCollection = client.db('orderDB').collection('orderCollection');

  //   get services data 
    app.get('/services', async(req, res)=>{ 
      const findData =   servicesCollection.find();
      const result =  await findData.toArray();
      res.send(result)
 })
 //  post services data 
app.post('/services', async(req, res)=>{
     const data = req.body;
     const result = await servicesCollection.insertOne(data);
     res.send(result)
})
// get services data bye id 
app.get("/services/:id",async (req, res)=>{
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)};
    const query = await servicesCollection.findOne(filter);
    res.send(query) 
 });
 

//  post order data 
app.post('/order', async(req, res)=>{
     const data =   req.body;
     const result = await ordersCollection.insertOne(data);
     res.send(result) 
})

// update order data by id 
app.put('/order/:id', async(req, res)=>{
  
  const id = req.params.id; 
   const filter = {_id: new ObjectId(id)};
  const options = { upsert: true };
  const updateData = {
    $set: {
       active : true        
    }
  }
  const result = await ordersCollection.updateOne(filter, updateData, options);
  res.send(result)
})
// get data by email
app.get('/order',async (req, res)=>{
   let findData = {};
   if(req.query?.email){
    findData = {email: req.query.email};
   }
   const result = await ordersCollection.find(findData).toArray();
   res.send(result)
}) 
// get order data
app.get('/order',async (req, res)=>{
     const findData = ordersCollection.find();
     const result = await findData.toArray();
     res.send(result)
})
// delet order data 

app.delete('/order/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id:new ObjectId(id)}
      const result = await ordersCollection.deleteOne(query)
      res.send(result)
})
 


 app.get('/product', async(req, res)=>{
      const findData = productCollection.find();
      const result = await findData.toArray();
      res.send(result)
 })




  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send('hello developer')
})

app.listen(port, ()=>{
    console.log(`your services port running ${port}`)
})