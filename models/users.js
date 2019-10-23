const db = require("./conn");

class User {
    constructor(first_name, last_name, email_address, password) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.email_address = email_address;
        this.password = password;
    }

    async login() {
        console.log("this is the login method", this.email_address);
    }

    async save() {
        console.log("this is the save method", this.email_address);
    }
}

module.exports = User;
