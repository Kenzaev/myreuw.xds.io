const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_db_password',
    database: 'ecommerce_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

const secret = 'your_jwt_secret';

app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(sql, [username, hashedPassword], (err, result) => {
        if (err) throw err;
        const token = jwt.sign({ username }, secret, { expiresIn: '1h' });
        res.json({ token });
    });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            bcrypt.compare(password, results[0].password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    const token = jwt.sign({ username: results[0].username }, secret, { expiresIn: '1h' });
                    res.json({ token });
                } else {
                    res.status(401).json({ message: 'Invalid password' });
                }
            });
        } else {
            res.status(401).json({ message: 'User not found' });
        }
    });
});

app.get('/api/products', (req, res) => {
    const sql = 'SELECT * FROM products';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/api/products', (req, res) => {
    const { name, price, video, image } = req.body;
    const sql = 'INSERT INTO products (name, price, video, image) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, price, video, image], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

app.delete('/api/products/:id', (req, res) => {
    const sql = 'DELETE FROM products WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
