require('dotenv').config();

const Pool = require('pg').Pool
const seed = new Pool({
    user: process.env.DB_USERNAME || 'superuser' ,
    password: process.env.DB_PASSWORD || '1234',
    database:'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT,
})


module.exports = seed


