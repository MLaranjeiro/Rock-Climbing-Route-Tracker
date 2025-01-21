const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'climbing_log'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

app.post('/api/routes', (req, res) => {
    const { gym, grade, attempts, sent, notes, imageUrl } = req.body;

    const query = 'INSERT INTO routes (gym, grade, attempts, sent, notes, image_url) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(query, [gym, grade, attempts, sent, notes, imageUrl], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Error inserting data');
            return;
        }
        console.log('Data inserted successfully:', result); 
        res.status(200).send('Data inserted successfully');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});