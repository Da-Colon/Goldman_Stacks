const db = require("./conn");
const bcrypt = require('bcryptjs')
const Moment = require('moment');

class User {
    constructor(first_name, last_name, email_address, password) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.email_address = email_address;
        this.password = password;
    }

    // BCrypt password compare
    checkPassword(hashedPassword) {
        return bcrypt.compareSync(this.password, hashedPassword);
    }

    // Retrieves user from DB, checks password and logs in / rejects
    async login() {
        try {
            const response = await db.one(`SELECT id, first_name, last_name, password FROM users WHERE email = $1;`, [this.email_address]);
            const isValid = this.checkPassword(response.password);
            if (!!isValid) {
                const { id, first_name, last_name } = response;
                return { isValid, id, first_name, last_name };
            } else {
                return { isValid }
            }
        } catch (err) {
            return err.message;
        }
    }

    // Creates a new user in the database
    async addNewUser() {
      const todayString = Moment(Date.now()).format('YYYY-MM-DD');
        try {
            const response = await db.one(
                `INSERT INTO users (first_name, last_name, email, password, portfolio_value, value_date) VALUES($1, $2, $3, $4, $5, $6) RETURNING id;`, [this.first_name, this.last_name, this.email_address, this.password, 100000, todayString]
            );
            return response;
        } catch (err) {
            return err.message;
        }
    }
}

module.exports = User;