const getPool = require('../../database')
class User {
    constructor(id, name, username, password, rolename, roleid, disabled) {
        this.id = id
        this.name = name
        this.username = username
        this.password = password
        this.rolename = rolename
        this.roleid = roleid
        this.disabled = disabled
    }

    static async getUserCount() {
        const sql = 'SELECT COUNT(*) as "numberusers" FROM users'
        const pool = getPool()
        const count = await pool.query(sql)
        if(count.rows.length > 0) {
            return count.rows[0].numberusers
        }
        return 0
    }

    static async getUserById(id) {
        const sql = 'SELECT * FROM users INNER JOIN roles ON users.roleid = roles.id WHERE id = $1'
        const user = await pool.query(sql, [id])
        if(user.rows.length > 0) {
            return new User(user.rows[0].id, user.rows[0].name, user.rows[0].username, user.rows[0].password, user.rows[0].rolename, user.rows[0].roleid, user.rows[0].disabled)
        }
        return null
    }

    static async getUsers(queryParams) {
        let whereQuery = ""
        let limitQuery = ""
        const pool = getPool()
        if(Object.keys(queryParams).length > 0){
            if(queryParams.username) {
                whereQuery = `WHERE username LIKE '%${queryParams.username}%'`
            }
            if(queryParams.roleid) {
                whereQuery = whereQuery ? `${whereQuery} AND users.roleid = ${queryParams.roleid}` : `WHERE users.roleid = ${queryParams.roleid}`
            }

            if(queryParams.name) {
                queryParams.name = queryParams.name.toLowerCase()
                whereQuery = whereQuery ? `${whereQuery} AND name LIKE '%${queryParams.name}%'` : `WHERE LOWER(name) LIKE '%${queryParams.name}%'`
            }

            if(queryParams.page && queryParams.limit) {
                const offset = (queryParams.page - 1) * queryParams.limit
                limitQuery = `OFFSET ${offset} LIMIT ${queryParams.limit}`
            }
        
        }
        

   

        const sql = `SELECT users.*, roles.description as "rolename" FROM users INNER JOIN roles ON users.roleid = roles.id ${whereQuery} AND users.disabled = false ORDER BY users.id ${limitQuery}`
        
        const users = await pool.query(sql)
        if(users.rows.length > 0) {
            return users.rows.map(user => {
                console.log(user)
                return new User(user.id, user.name, user.username, user.password, user.rolename, user.roleid, user.disabled) 
            
            })
        }

        return []


    }


    static async createUser(name, username, password, roleid) {
        const pool = getPool()
        const sql = 'INSERT INTO users (name, username, password, roleid) VALUES ($1, $2, $3, $4) RETURNING *'
        const user = await pool.query(sql, [name, username, password, roleid])
        if(user.rows.length > 0) {
            return new User(user.rows[0].id, user.rows[0].name, user.rows[0].username, user.rows[0].password, "", user.rows[0].roleid, user.rows[0].disabled)
        }
        return null
    }

    static async getByUsername(username) {
        const pool = getPool()
        const sql = 'SELECT *, roles.description as "rolename" FROM users INNER JOIN roles ON users.roleid = roles.id WHERE username = $1'
        const user = await pool.query(sql, [username])
        if(user.rows.length > 0) {
            return new User(user.rows[0].id, user.rows[0].name, user.rows[0].username, user.rows[0].password, user.rows[0].rolename, user.rows[0].roleid, user.rows[0].disabled)
        }
        return null
    }

    static async disableUser(username) {
        const pool = getPool()
        console.log(username)
        const sql = 'UPDATE users SET disabled = true WHERE username = $1 RETURNING *'
        
        const user = await pool.query(sql, [username])

        console.log(user.rows[0])
        if(user.rows.length > 0) {
            if(user.rows[0].disabled) {
                return true
            }
            else {
                return false
            }
        }
    
        return null
    }

    static async getDisabledUsers() {
        const pool = getPool()
        const sql = 'SELECT * FROM users WHERE disabled = true'
        const users = await pool.query(sql)
        if(users.rows.length > 0) {
            return users.rows.map(user => new User(user.id, user.name, user.username, user.password, user.rolename, user.roleid, user.disableUser))
        }
        return []
    }

    static async enableUser(username) {
        const pool = getPool()
        const sql = 'UPDATE users SET disabled = false WHERE username = $1 RETURNING *'
        const user = await pool.query(sql, [username])
        if(user.rows.length > 0) {
            if(user.rows[0].disabled) {
                return true
            }
            else {
                return false
            }
        }
    
        return null
    }
}

module.exports = User