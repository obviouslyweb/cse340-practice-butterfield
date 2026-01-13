/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

// RUN FOR DEV: pnpm run dev
// RUN FOR PROD: pnpm run start (not functional locally)

/* 
Imports
*/
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

/* 
Declare important variables
*/
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url); // Provides URL of current module & converts to file system path
const __dirname = path.dirname(__filename); // Extract directory from filename when needing to serve static files

/* 
Setup Express Server
*/
const app = express();

/* 
Configure Express middleware
*/
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

/* 
Declare routes
*/

// Home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/home.html'));
});

// About page
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/about.html'));
});

// Products page
app.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/products.html'));
});

/*  
Start server & listen on ports
*/
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});