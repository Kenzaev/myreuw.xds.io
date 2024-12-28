const bcrypt = require('bcryptjs');
const saltRounds = 10;

const hashPassword = (password) => {
    return bcrypt.hashSync(password, saltRounds);
};

const comparePassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
};
