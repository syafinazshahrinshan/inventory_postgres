const express = require('express');
const app = express();

const cors = require('cors')
app.use(
    cors({
        origin:"*",
    })
)

//run queries on the pool
const pool = require("./db")

app.use(express.json()) // -> req.body


// ROUTES 

// GET ALL
app.get("/inventory/getAll", async(req,res)=>{

    try {
        
        const allProducts = await pool.query("SELECT * FROM inventory")
        res.json(allProducts.rows)

    } catch (error) {
        console.error(error.message)
        res.json(error.message)
    }
}) 

// GET One Item
app.get("/inventory/:itemID", async(req,res)=>{
    try {
        const {itemID} = req.params

        const allProducts = await pool.query("SELECT * FROM inventory Where itemID=$1",[itemID])
        res.json(allProducts.rows)

    } catch (error) {
        console.error(error.message)
        res.json(error.message)
    }
}) 


//GET IF PRODUCTS ARE AVAILABLE
app.get("/inventory/available", async(req,res)=>{
    try {
        const allProducts = await pool.query("SELECT * FROM inventory WHERE IsAvailable=TRUE ")
        res.json(allProducts.rows)

    } catch (error) {
        console.error(error.message)
        res.json(error.message)
    }
})

// CREATE
app.post('/inventory/create', async(req,res)=>{
    

    try {
        const {name, quantity, isAvailable, pricePerItem, url} = req.body
        const newProduct = await pool.query("INSERT INTO inventory(name, quantity, isAvailable, pricePerItem, url) VALUES ($1,$2,$3,$4,$5) RETURNING *",[name,quantity,isAvailable,pricePerItem,url])
        res.json(newProduct)
        console.log("Product Created")
    } catch (error) {
        console.error(error.message)
        res.json(error.message)
    }
})

//UPDATE
app.put("/inventory/:itemID",async(req,res)=>{
    try {
        const{itemID}=req.params //WHERE
        const{quantity} = req.body // SET

        const updateProduct= await pool.query("UPDATE inventory SET quantity = $1 WHERE itemID=$2", [quantity,itemID])

        res.json("Update Successful!")
    } catch (error) {
        console.error(error.message)
        res.json(error.message)
    }
})


//UPDATE
app.put("/inventory/update-value/:itemID",async(req,res)=>{
    try {
        const{itemID}=req.params //WHERE
        const{quantity} = req.body // SET

        const p = await pool.query("SELECT * FROM inventory Where itemID=$1",[itemID])
        if(p.rowCount==0){
            res.status(404).json("Item Not Found");
        }
        let product = p.rows[0];
        let newQuantity = product.quantity - quantity
        const updateProduct= await pool.query("UPDATE inventory SET quantity = $1 WHERE itemID=$2", [newQuantity,itemID])

        res.json("Update Successful!")
    } catch (error) {
        console.error(error.message)
        res.json(error.message)
    }
})

//DELETE
app.delete("/inventory/:itemID", async(req,res)=>{
    try {
        const{itemID}=req.params
        const deleteProduct = await pool.query("DELETE FROM inventory WHERE itemID=$1",[itemID])

        res.json("Product was deleted!")
    } catch (error) {
        console.error(error.message)
        res.json(error.message)
    }
})

app.get('/', function(req, res) {
    res.send('Hello world!')
}); 

app.listen(3050, async() => {
    const allProducts = await pool.query("SELECT * FROM inventory")
    //Seeding data
    if(allProducts.rowCount==0){
        await pool.query("INSERT INTO inventory(name, quantity, isAvailable, pricePerItem, url) VALUES ($1,$2,$3,$4,$5) RETURNING *",["Saka68",100,true,349,"https://cdn.shopify.com/s/files/1/0068/3599/4706/products/DSC02005_1296x.jpg?v=1645802112"])
        await pool.query("INSERT INTO inventory(name, quantity, isAvailable, pricePerItem, url) VALUES ($1,$2,$3,$4,$5) RETURNING *",["Ikki68",100,true,412,"https://cdn.shopify.com/s/files/1/0238/7342/1376/products/mizu-1_1080x.jpg?v=1614126661"])
        await pool.query("INSERT INTO inventory(name, quantity, isAvailable, pricePerItem, url) VALUES ($1,$2,$3,$4,$5) RETURNING *",["Aozora",100,true,250,"https://i.imgur.com/d5QJbiQ.jpeg"])
    }
    console.log('Server Started');
});
