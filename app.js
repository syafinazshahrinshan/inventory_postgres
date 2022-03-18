const express = require('express');
const app = express();


//run queries on the pool
const pool = require("./db")

app.use(express.json()) // -> req.body


// ROUTES 

//GET
app.get("/inventory", async(req,res)=>{
    try {
        const allProducts = await pool.query("SELECT * FROM inventory")
        res.json(allProducts.rows)

    } catch (error) {
        console.error(error.message)
    }
})

// CREATE
app.post('/inventory', async(req,res)=>{
    try {
        const {itemID, quantity, IsAvailable, PricePerItem,CreatedAt,sellerID} = req.body
        const newProduct = await pool.query("INSERT INTO inventory(itemID, quantity, IsAvailable, PricePerItem,CreatedAt,sellerID) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",[itemID, quantity,IsAvailable,PricePerItem,CreatedAt,sellerID])
        
        res.json(newProduct)
    } catch (error) {
        console.error(error.message)
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
    }
})

app.get('/', function(req, res) {
    res.send('Hello world!')
}); 

app.listen(8080, () => {
    console.log('Server Started');
});
