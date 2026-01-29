// "node server.js" for prod
// "pnpm run dev" for dev
// DON'T FORGET TO VERIFY ENV!

/* eslint-disable no-undef */

/*
Import express components
*/
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

/*
Import MVC components
*/
import routes from './src/controllers/routes.js';
import { addLocalVariables } from './src/middleware/global.js';
import { notFound, errorHandler } from './src/controllers/errors.js';

/**
 * Server configuration
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

/**
 * Setup Express Server
 */
const app = express();

/**
 * Configure Express
 */
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

/**
 * Global Middleware
 */
app.use(addLocalVariables);

/**
 * Routes
 */
app.use('/', routes);

/**
 * Error Handling
 */
app.use(notFound);
app.use(errorHandler);

/**
 * Start WebSocket Server in dev mode (used for live reload)
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

/**
 * Start server
 */
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});