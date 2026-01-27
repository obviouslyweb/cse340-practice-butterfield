// import process from "./server.js";

/**
 * Helper function to get the current greeting based on the time of day.
 */
const getCurrentGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
        return 'Good morning!';
    }

    if (currentHour < 18) {
        return 'Good afternoon!';
    }

    return 'Good evening!';
};

// app.use((req, res, next) => {
//     // Add current year for copyright; USED IN FOOTER
//     res.locals.currentYear = new Date().getFullYear();
//     // Add current time for greeting message; USED IN HEADER
//     res.locals.currentHour = new Date().getHours();
//     res.locals.currentHalf = "AM";
//     if (res.locals.currentHour > 13) {
//         res.locals.currentHour -= 12;
//         res.locals.currentHalf = "PM";
//     }
//     res.locals.currentMin = new Date().getMinutes();

//     next();
// });
// // Global middleware for time-based greeting
// app.use((req, res, next) => {
//     const currentHour = new Date().getHours();
//     if (currentHour < 12) {
//         res.locals.greeting = 'morning';
//     } else if (currentHour < 17) {
//         res.locals.greeting = 'afternoon';
//     } else {
//         res.locals.greeting = 'evening';
//     }

//     next();
// });

/**
 * Middleware to add local variables to res.locals for use in all templates.
 * Templates can access these values but are not required to use them.
 */
const addLocalVariables = (req, res, next) => {
    // Set current year for use in templates
    res.locals.currentYear = new Date().getFullYear();

    // Make NODE_ENV available to all templates
    res.locals.NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

    // Make req.query available to all templates
    res.locals.queryParams = { ...req.query };

    // Set greeting based on time of day
    res.locals.greeting = `<p>${getCurrentGreeting()}</p>`;

    // Randomly assign a theme class to the body
    const themes = ['blue-theme', 'green-theme', 'red-theme'];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    res.locals.bodyClass = randomTheme;

    // Continue to the next middleware or route handler
    next();
};

export { addLocalVariables };