const pg = require('pg');

require('dotenv').config();

function getPool() {
    return new pg.Pool({
        connectionString: process.env.DATABASE_URL
    })
}
module.exports = getPool