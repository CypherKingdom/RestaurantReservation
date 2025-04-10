const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create a more robust connection configuration using environment variables
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectTimeout: 10000, // 10 seconds timeout
});

// Handle connection errors and implement reconnection logic
function handleDisconnect() {
    db.connect(err => {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            console.log('Attempting to reconnect in 2 seconds...');
            setTimeout(handleDisconnect, 2000); // Try to reconnect after 2 seconds
        } else {
            console.log('Connected to MySQL database successfully');
            
            // Create database and tables if they don't exist
            ensureDatabaseSetup();
        }
    });

    // Handle runtime errors and connection loss
    db.on('error', function(err) {
        console.error('MySQL connection error:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || 
            err.code === 'ECONNREFUSED' || 
            err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
            console.log('Lost connection to MySQL. Reconnecting...');
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

// Function to ensure database and tables exist
function ensureDatabaseSetup() {
    // First, create the database if it doesn't exist
    db.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'bookingtable'}`, (err) => {
        if (err) {
            console.error('Error creating database:', err);
            return;
        }
        
        // Use the database
        db.query(`USE ${process.env.DB_NAME || 'bookingtable'}`, (err) => {
            if (err) {
                console.error('Error using database:', err);
                return;
            }
            
            // Create users table if it doesn't exist
            const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users(
                Id INT AUTO_INCREMENT PRIMARY KEY,
                FirstName VARCHAR(50),
                LastName VARCHAR(50),
                Password VARCHAR(50),
                GuestNbr INT,
                \`Phone number\` VARCHAR(15),
                \`E-mail\` VARCHAR(50) UNIQUE
            )`;
            
            db.query(createUsersTable, (err) => {
                if (err) console.error('Error creating users table:', err);
                else console.log('Users table ready');
            });
            
            // Create reservation table if it doesn't exist
            const createReservationTable = `
            CREATE TABLE IF NOT EXISTS reservation (
                ResId INT AUTO_INCREMENT PRIMARY KEY,
                UserId INT,
                GuestNbr INT,
                LastName VARCHAR(50),
                \`Phone number\` VARCHAR(15),
                \`E-mail\` VARCHAR(50),
                \`date\` DATE,
                \`time\` TIME,
                area VARCHAR(20),
                FOREIGN KEY (UserId) REFERENCES users (Id)
            )`;
            
            db.query(createReservationTable, (err) => {
                if (err) console.error('Error creating reservation table:', err);
                else console.log('Reservation table ready');
            });
        });
    });
}

// Initialize the connection
handleDisconnect();

// Define a simple health check endpoint
app.get('/', (req, res) => {
    res.json({ status: 'Restaurant Reservation API is running' });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE `E-mail` = ? AND Password = ?';
    db.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error('Login error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length > 0) {
            const user = results[0];
            res.json({ 
                success: true, 
                user: {
                    id: user.Id,
                    firstName: user.FirstName,
                    lastName: user.LastName,
                    phone: user['Phone number'],
                    email: user['E-mail']
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
});

app.post('/register', (req, res) => {
    const { firstName, lastName, password, phone, email } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !password || !phone || !email) {
        return res.status(400).json({ 
            success: false, 
            error: 'All fields are required' 
        });
    }
    
    const sql = 'INSERT INTO users (FirstName, LastName, Password, `Phone number`, `E-mail`) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [firstName, lastName, password, phone, email], (err, result) => {
        if (err) {
            console.error('Registration error:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Email already exists' 
                });
            }
            return res.status(500).json({ 
                success: false, 
                error: 'Registration failed'
            });
        }
        
        console.log('User registered successfully:', result);
        res.json({ success: true });
    });
});

app.post('/reserve', (req, res) => {
    const { userId, guestNbr, lastName, phone, email, date, time, area } = req.body;
    
    // Validate required fields
    if (!userId || !guestNbr || !lastName || !phone || !email || !date || !time || !area) {
        return res.status(400).json({ 
            success: false, 
            error: 'All fields are required' 
        });
    }
    
    const sql = 'INSERT INTO reservation (UserId, GuestNbr, LastName, `Phone number`, `E-mail`, date, time, area) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [userId, guestNbr, lastName, phone, email, date, time, area], (err, result) => {
        if (err) {
            console.error('Reservation error:', err);
            return res.status(500).json({ 
                success: false, 
                error: 'Reservation failed'
            });
        }
        
        console.log('Reservation created successfully:', result);
        res.json({ success: true });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});