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
const courses = { // Course data - place this after imports, before routes
    'CS121': {
        id: 'CS121',
        title: 'Introduction to Programming',
        description: 'Learn programming fundamentals using JavaScript and basic web development concepts.',
        credits: 3,
        sections: [
            { time: '9:00 AM', room: 'STC 392', professor: 'Brother Jack' },
            { time: '2:00 PM', room: 'STC 394', professor: 'Sister Enkey' },
            { time: '11:00 AM', room: 'STC 390', professor: 'Brother Keers' }
        ]
    },
    'MATH110': {
        id: 'MATH110',
        title: 'College Algebra',
        description: 'Fundamental algebraic concepts including functions, graphing, and problem solving.',
        credits: 4,
        sections: [
            { time: '8:00 AM', room: 'MC 301', professor: 'Sister Anderson' },
            { time: '1:00 PM', room: 'MC 305', professor: 'Brother Miller' },
            { time: '3:00 PM', room: 'MC 307', professor: 'Brother Thompson' }
        ]
    },
    'CSE340': {
        id: 'CSE340',
        title: 'Web Backend Development',
        description: 'Learn how to develop scalable, dynamic web applications through Express and nodeJS.',
        credits: 3,
        sections: [
            { time: '1:00 PM', room: 'STC 231', professor: 'Sister Keys' }
        ]
    },
    'ENG101': {
        id: 'ENG101',
        title: 'Academic Writing',
        description: 'Develop writing skills for academic and professional communication.',
        credits: 3,
        sections: [
            { time: '10:00 AM', room: 'GEB 201', professor: 'Sister Anderson' },
            { time: '12:00 PM', room: 'GEB 205', professor: 'Brother Davis' },
            { time: '4:00 PM', room: 'GEB 203', professor: 'Sister Enkey' }
        ]
    }
};


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

// Global template variables middleware
// (Make common variables available to all EJS templates without having to pass them individually from each route handler)
app.use((req, res, next) => {
    // Make NODE_ENV available to all templates
    res.locals.NODE_ENV = NODE_ENV.toLowerCase() || 'production';

    // Continue to next middleware/route handler
    next();
});
// Log incoming requests to console
app.use((req, res, next) => {
    // Skip logging for routes that start with /.
    if (!req.path.startsWith('/.')) {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});
// Add global data to all templates
app.use((req, res, next) => {
    // Add current year for copyright; USED IN FOOTER
    res.locals.currentYear = new Date().getFullYear();
    // Add current time for greeting message
    res.locals.currentHour = new Date().getHours();
    res.locals.currentHalf = "AM";
    if (res.locals.currentHour > 13) {
        res.locals.currentHour -= 12;
        res.locals.currentHalf = "PM";
    }
    res.locals.currentMin = new Date().getMinutes();

    next();
});
// Global middleware for time-based greeting
app.use((req, res, next) => {
    const currentHour = new Date().getHours();
    // console.log(currentHour);
    if (currentHour < 12) {
        res.locals.greeting = 'morning';
    } else if (currentHour < 17) {
        res.locals.greeting = 'afternoon';
    } else {
        res.locals.greeting = 'evening';
    }

    next();
});
// Global middleware for random theme selection
app.use((req, res, next) => {
    // Define themes
    const themes = ['blue-theme', 'green-theme', 'red-theme'];

    // Choose random theme
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    res.locals.bodyClass = randomTheme;
    console.log(res.locals.bodyClass);

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
// Course catalog page
app.get('/catalog', (req, res) => {
    res.render('catalog', {
       title: 'Course Catalog',
       courses: courses 
    });
});
// Course detail page (from catalog page) w/ route parameter handling
app.get('/catalog/:courseId', (req, res, next) => {
    const courseId = req.params.courseId;
    const course = courses[courseId];

    // Return 404 if course isn't found
    if (!course) {
        const err = new Error(`Course ${courseId} not found`);
        err.status = 404;
        return next(err);
    }

    // Get sort parameter (default to 'time')
    const sortBy = req.query.sort || 'time';

    // Create a copy of sections to sort
    let sortedSections = [...course.sections];

    // Sort based on the parameter
    switch (sortBy) {
        case 'professor':
            sortedSections.sort((a, b) => a.professor.localeCompare(b.professor));
            break;
        case 'room':
            sortedSections.sort((a, b) => a.room.localeCompare(b.room));
            break;
        case 'time':
        default:
            // Keep original time order as default
            break;
    }

    console.log(`Viewing course: ${courseId}, sorted by: ${sortBy}`);

    res.render('course-detail', {
        title: `${course.id} - ${course.title}`,
        course: { ...course, sections: sortedSections },
        currentSort: sortBy
    });
});


/*
Error declaration
*/
// Test route for 500 errors
app.get('/test-error', (req, res, next) => {
    const err = new Error('This is a test error.');
    err.status = 500;
    next(err);
});
// Catch-all route for 404 errors; only runs when no other route matches
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});
// Global error handler for other cases
app.use((err, req, res, next) => {
    // Prevent infinite loops; if response already sent, then do nothing
    if (res.headersSent || res.finished) {
        return next(err);
    }

    // Determine status and template
    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';

    // Prepare data for template
    const context = {
        title: status === 404 ? 'Page Not Found' : "Server Error",
        error: NODE_ENV === 'production' ? 'An error occured' : err.message,
        stack: NODE_ENV === 'production' ? null : err.stack,
        NODE_ENV // Websocket check needs this
    };

    // Render correct error template w/ fallback
    try {
        res.status(status).render(`errors/${template}`, context);
    } catch (renderErr) {
        // If rendering fails, send simple error page as backup
        if (!res.headersSent) {
            res.status(status).send(`<h1>Error ${status}</h1><p>An error occured; we're sorry!</p>`);
        }
    }
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