const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = function(username, password) {
    this.username = username;
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(password, salt);
};

module.exports = User;

