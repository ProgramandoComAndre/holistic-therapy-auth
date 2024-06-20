const pool = require('../../database')
class Role {
    constructor(id, name) {
        this.id = id
        this.name = name
    }

    static async getRoles() {
        const sql = 'SELECT * FROM roles'
        const roles = await pool.query(sql)
        if(roles.rows.length > 0) {
            return roles.rows.map(role => new Role(role.id, role.name))
        }
        return []
    }

    static async getRole(id) {
        const sql = 'SELECT * FROM roles WHERE id = $1'
        const role = await pool.query(sql, [id])
        if(role.rows.length > 0) {
            return new Role(role.rows[0].id, role.rows[0].name)
        }
        return null
    }

    static async createRole(name) {
        const sql = 'INSERT INTO roles (name) VALUES ($1) RETURNING *'
        const role = await pool.query(sql, [name])
        if(role.rows.length > 0) {
            return new Role(role.rows[0].id, role.rows[0].name)
        }
        return null
    }
}

module.exports = Role