import { Router } from 'express';

// Create a new router instance
const router = Router();

/*
Add import statements for controllers and middleware
*/
// Middleware
import { addDemoHeaders } from '../middleware/demo/headers.js';
// Controllers (for page routing)
import { catalogPage, courseDetailPage } from './catalog/catalog.js';
import { homePage, aboutPage, demoPage, testErrorPage } from './index.js';
import { facultyListPage, facultyDetailPage } from './faculty/faculty.js';

/*
Add route definitions
*/
// Home and basic pages
router.get('/', homePage);
router.get('/about', aboutPage);

// Course catalog routes
router.get('/catalog', catalogPage);
router.get('/catalog/:courseId', courseDetailPage);

// Faculty routes
router.get('/faculty', facultyListPage);
router.get('/faculty/:facultyId', facultyDetailPage);

// Demo page with special middleware
router.get('/demo', addDemoHeaders, demoPage);

// Route to trigger a test error
router.get('/test-error', testErrorPage);

/*
Export router for usage in server.js
*/
export default router;