const supertest = require("supertest")
const testContainers = require("testcontainers")
const app = require("../app")
const axios = require("axios")

jest.setTimeout(999999)

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const dockerEnvironment = new testContainers.DockerComposeEnvironment("./", ["docker-compose.test.yaml"])
async function setup() {
    
   return dockerEnvironment.withWaitStrategy("rabbitmq", testContainers.Wait.forLogMessage("started TCP listener on [::]:5672"))
   .withWaitStrategy("auth_db", testContainers.Wait.forLogMessage("database system is ready to accept connections"))
   .withWaitStrategy("therapist_db", testContainers.Wait.forLogMessage("database system is ready to accept connections"))
   .withWaitStrategy("therapist", testContainers.Wait.forLogMessage("Server running on port 3002")).withPullPolicy(testContainers.PullPolicy.defaultPolicy()).withBuild().up()
    
}

describe("Auth test",() => {
    let dockerEnv = null
    let request = null
    let token = ""
    beforeAll(async () => {
        app.configureApp()
        request = supertest(app.app)
        dockerEnv = await app.testConfig(setup)
        console.log(typeof dockerEnv)
        
    }) 

    afterAll(() => {
        dockerEnv.down()
    })

    it("deve fazer o login", async () => {
        
        // Given
        const username = "admin"
        const password = "admin123"

        // When
        const response = await request.post("/users/auth").send({username, password})
        // Then

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({token: expect.any(String)})

        token = response.body.token
    })

    it("deve registar um novo utilizador com sucesso", async () => {

        // Given
        const req = {
            name: "John Doe",
            username: "johndoe",
            password: "johndoe123",
            confirmPassword: "johndoe123",
            roleid: 3
        }

        const user = await request.post("/users").send(req).set({"Authorization": `Bearer ${token}`})

        // Then
        // Should be 201 fix later
        expect(user.statusCode).toBe(200)
        expect(user.body).toEqual({id: expect.any(Number), name: req.name, username: req.username, password: expect.any(String), rolename: expect.any(String), roleid: 3, disabled: false})
    })
    it("deve registar um novo terapeuta com sucesso", async () => {

        // Given
        const req = {
            name: "John Doe",
            username: "johndoetherapist",
            password: "johndoe123",
            specialities: ["EFT", "Psychology"],
            confirmPassword: "johndoe123",
            roleid: 2
        }

        const user = await request.post("/users").send(req).set({"Authorization": `Bearer ${token}`})

        // Then
        // Should be 201 fix later

        expect(user.statusCode).toBe(200)
        expect(user.body).toEqual({id: expect.any(Number), name: req.name, username: req.username, password: expect.any(String), rolename: expect.any(String), roleid: 2, disabled: false})
        
        await wait(10000)

        const therapist = await axios.get(`http://localhost:3002/therapists/profile/${user.body.username}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        console.log(therapist.data)
        expect(therapist.data.username).toBe(user.body.username)

    })
}) 