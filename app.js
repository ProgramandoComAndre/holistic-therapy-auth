const express = require('express');
const app = express();
const cors = require('cors')
const UserRouter = require('./src/routes/User');

require('dotenv').config()

class App {
    constructor(port, env) {
        this.port = port
        this.env = env
        this.app = express()
    }

    configureApp() {
        this.app.use(express.json());
        this.app.use(cors())
        this.app.get('/', (req, res) => {
            res.send('Hello from auth server');
        });
        this.app.use('/users',UserRouter);
    }

    start() {
        this.app.listen(this.port, '0.0.0.0' ,() => {
            console.log(`Server running on port ${this.port}`);
        })
    }

    async testConfig(testConfigCallback) {
        require('dotenv').config({path: "./test.env"})
        return testConfigCallback()
    }
}

module.exports = new App(process.env.API_PORT, process.env.ENV)