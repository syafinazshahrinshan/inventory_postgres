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
const seed = require("./seed")

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
app.get("/inventory/all/available", async(req,res)=>{
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
    try{
        await seed.query(`CREATE DATABASE inventory_database;`);
        
    }catch(err){
        console.log(err)
    }
    
    try{
        await pool.query(`CREATE TABLE inventory(
            itemID SERIAL PRIMARY KEY,
            name VARCHAR(255),
            quantity INT NOT NULL,
            isAvailable boolean DEFAULT false NOT NULL,
            pricePerItem DOUBLE PRECISION NOT NULL,
            url VARCHAR(255),
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`);        
    }catch(err){
        console.log(err)
    }

    try{
        const allProducts = await pool.query("SELECT * FROM inventory")
        //Seeding data
        if(allProducts.rowCount==0){    
            await pool.query(`INSERT INTO public.inventory (name,quantity,isavailable,priceperitem,url) VALUES
            ('Elowyn Sweetheart Knit Top',229,true,36.9,'https://media.lovebonito.com/media/catalog/product/t/h/th2120-031-1_1oajgoomos6tmirg.jpg?width=960&height=1344'),
            ('Mayven Classic Button Down Shirt',107,true,39.9,'https://media.lovebonito.com/media/catalog/product/t/h/th1374-031_86vfy4q9pjntzkrq.jpg?width=960&height=1344'),
            ('Sarah Button Down Cardigan',63,true,41.9,'https://media.lovebonito.com/media/catalog/product/t/h/th1714-047_14.jpg?width=960&height=1344'),
            ('Kasey Tiered Crinkled Dress',2,true,53.9,'https://media.lovebonito.com/media/catalog/product/t/h/th1826-031_r7vqrhw36yapilo3.jpg?width=960&height=1344'),
            ('Morie High Waisted Straight Leg Pants',74,true,53.9,'https://media.lovebonito.com/media/catalog/product/h/y/hy3589-047-1_rj5wqkcw1bxcfawh.jpg?width=960&height=1344'),
            ('Roxanne Tailored Peg Leg Pants',61,true,49.9,'https://media.lovebonito.com/media/catalog/product/t/h/th1813-031_ze7hzx1cddciwwd5.jpg?width=960&height=1344'),
            ('Arianne Tie Front Dress',339,true,49.9,'https://media.lovebonito.com/media/catalog/product/t/h/th2096-261-1_7sznoafdiphxz5qw.jpg?width=960&height=1344'),
            ('Wyetta Tailored Cape Blazer',92,true,65.9,'https://media.lovebonito.com/media/catalog/product/h/y/hy5180-031.jpg?width=960&height=1344'),
            ('Glynne Jersey Sweetheart Tie Back Top',26,true,41.9,'https://media.lovebonito.com/media/catalog/product/t/h/th1913-014-1_cxukjxt3u1ztfisj.jpg?width=960&height=1344'),
            ('Amita Tailored Shorts',43,true,39.9,'https://media.lovebonito.com/media/catalog/product/t/h/th1192-031_fkcrrvdlhnzbtfz4.jpg?width=960&height=1344'),
            ('Keyla Cupro Twist Front Top',102,true,36.9,'https://media.lovebonito.com/media/catalog/product/l/n/ln0884-052-1_gxfzqmsltx74juia.jpg?width=960&height=1344');`)
        }     
    }catch(err){
        console.log(err)
    }


    console.log('Server Started');
});
