const express = require("express");
const router = express.Router();
const {MongoClient} = require("mongodb");
const {ObjectId} = require("mongodb");

const uri =
  "mongodb://localhost:27017/salestr";


router.get('/', async (req,res) => {
    res.send("Sales here!");
})

router.get('/sales', async (req,res) => {
    const client = new MongoClient(uri,{useUnifiedTopology: true});
    try {
        await client.connect();

        const cursor = await client.db("saletr").collection("debtors").find({});
        const result = await cursor.toArray();
        if(result.length > 0){
           result.forEach((result,i)=> {
               console.log();
               console.log(`${i + 1}. name: ${result.name}`)
           })
            try{
                res.json(result)
            } catch (e) {
                console.log(e)
            }
        }

    } catch (e) {
        console.log(e);
    } finally {
        await client.close();
    }
})

router.post('/create-sales', async (req,res) => {
    const client = new MongoClient(uri,{useUnifiedTopology: true});
    try {
        // Connect to the MongoDB cluster
        await client.connect();
 
        const result = await client.db("saletr").collection("debtors").insertOne({
            name: req.body.name,
            amount: req.body.amount
        })
        
        console.log(`New debtor created with the following id: ${result.insertedId}`)
        try {
            res.json(`New debtor created with the following id: ${result.insertedId}`)
        } catch (error) {
            console.log(error)
        }
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
});

router.put('/update/:id', async (req,res) => {
    const client = new MongoClient(uri,{useUnifiedTopology: true});
    try {
        const id = req.params.id;
        const o_id = ObjectId(id);
        await client.connect();
        const result = await client.db("saletr").collection("debtors")
            .updateOne({"_id": o_id}, {$set:{
                name: "Spencer D",
                amount: 700
                } 
            });
        if(result){
            console.log(`${result.matchedCount} document(s) the query criteria.`)
            console.log(`${result.modifiedCount} document(s) were updated.`)
            res.json(`${result.modifiedCount} document(s) were updated.`)
        }
    } catch (error) {
        console.log(error);
    } finally {
        await client.close();
    }
});

router.delete('/delete-sale/:id', async (req,res) => {
    const client = new MongoClient(uri,{useUnifiedTopology: true});
    try{
        const id = req.params.id;
        const o_id = ObjectId(id);
        await client.connect();
        const result = await client.db("saletr").collection("debtors")
            .deleteOne({"_id": o_id})
        if(result){
            console.log(`${result.deletedCount} document(s) was deleted`);
            res.json(`${result.deletedCount} document(s) was deleted`)
        }
    } catch(error){
        console.log(error);
    } finally {
        await client.close();
    }
})


module.exports = router;