/**
 * Middleware to require authentication for protected routes.
 * Redirects to login page if user is not authenticated.
 * Sets res.locals.isLoggedIn = true for authenticated requests.
 */
const requireLogin = (req, res, next) => {
    // Check if user is logged in via session; we can beef this up later with roles and permissions
    if (req.session && req.session.user) {
        // User is authenticated - set UI state and continue
        res.locals.isLoggedIn = true;
        next();
    } else {
        // User is not authenticated - redirect to login
        req.flash('error', 'You are not authorized to view the content you were trying to access. Please login and try again.');
        res.redirect('/login');
    }
};

export { requireLogin };