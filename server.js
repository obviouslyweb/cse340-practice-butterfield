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
const NODE_ENV = process.env.NODE_ENV || 'production'; // Default to production unless .env loaded
const PORT = process.env.PORT || 3000; // Define port, 3000 default
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
// Set EJS as the templating engine here
app.set('view engine', 'ejs');
// Tell Express where the templates are located
app.set('views', path.join(__dirname, 'src/views'));

/*
Global template variables middleware
(Make common variables available to all EJS templates without having to pass them individually from each route handler)
*/
app.use((req, res, next) => {
    // Make NODE_ENV available to all templates
    res.locals.NODE_ENV = NODE_ENV.toLowerCase() || 'production';

    // Continue to next middleware/route handler
    next();
});

/* 
Declare routes
*/
// Home page
app.get('/', (req, res) => {
    const title = 'Welcome Home!';
    res.render('home', { title });
});
// About page
app.get('/about', (req, res) => {
    const title = 'About Me';
    res.render('about', { title });
});
// Products page
app.get('/products', (req, res) => {
    const title = 'Products';
    res.render('products', { title });
});

/*
Dev mode starting conditions
(When in development mode, start a WebSocket server for live reloading)
*/
if (NODE_ENV.includes('dev')) {
    const ws = await import('ws');

    try {
        const wsPort = parseInt(PORT) + 1;
        const wsServer = new ws.WebSocketServer({ port: wsPort });

        wsServer.on('listening', () => {
            console.log(`WebSocket server is running on port ${wsPort}`);
        });

        wsServer.on('error', (error) => {
            console.error('WebSocket server error:', error);
        });
    } catch (error) {
        console.error('Failed to start WebSocket server:', error);
    }
}

/*  
Start server & listen on ports
*/
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});