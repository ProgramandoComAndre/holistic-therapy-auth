const express = require('express');
const app = express();
const cors = require('cors')
const UserRouter = require('./src/routes/User');

require('dotenv').config();

const port = process.env.API_PORT || 3000;

app.use(express.json());
app.use(cors())
app.get('/', (req, res) => {
    res.send('Hello from auth server');
});


app.use('/users',UserRouter);


app.listen(port, '0.0.0.0' ,() => {
    console.log(`Server running on port ${port}`);
})