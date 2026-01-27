/* eslint-disable no-undef */

/**
 * Helper function to get the current greeting based on time.
 */
const getCurrentGreeting = () => {
    const now = new Date();
    const hour24 = now.getHours();
    const minute = now.getMinutes().toString().padStart(2, '0');

    const timeHalf = hour24 >= 12 ? 'PM' : 'AM';
    const hour12 = hour24 % 12 || 12;

    let greeting;
    if (hour24 < 12) {
        greeting = 'Good morning';
    } else if (hour24 < 18) {
        greeting = 'Good afternoon';
    } else {
        greeting = 'Good evening';
    }

    return `${greeting}! It's currently ${hour12}:${minute} ${timeHalf}.`;
};

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