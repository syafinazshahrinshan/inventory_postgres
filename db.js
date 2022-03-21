const Pool = require('pg').Pool
const pool = new Pool({
    user:'superuser',
    password:'1234',
    database:'inventory_database',
    host:'localhost',
    port:5433
})

module.exports = pool