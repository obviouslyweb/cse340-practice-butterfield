import { getFacultyById, getSortedFaculty } from '../../models/faculty/faculty.js';

// Route handler for the faculty list
const facultyListPage = (req, res) => {
    const sortBy = req.query.sort;
    const faculty = getSortedFaculty(sortBy);

    res.render('faculty/list', {
        title: 'Faculty List',
        faculty: faculty,
        currentSort: sortBy
    });
};

// Route handler for looking up individual faculty
const facultyDetailPage = (req, res, next) => {
    const facultyId = req.params.facultyId;
    const faculty = getFacultyById(facultyId);

    // If faculty member doesn't exist, create 404 error
    if (!faculty) {
        const err = new Error(`Faculty ${facultyId} not found`);
        err.status = 404;
        return next(err);
    }

    res.render('faculty/detail', {
        title: `${faculty.name} - ${faculty.title}`,
        faculty,
        facultyId
    });
};

export { facultyListPage, facultyDetailPage };