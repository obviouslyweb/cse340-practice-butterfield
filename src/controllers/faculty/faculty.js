import { getFacultyBySlug, getSortedFaculty } from '../../models/faculty/faculty.js';

// Route handler for the faculty list
const facultyListPage = async (req, res) => {
    const validSorts = ['name', 'department', 'title'];
    const sortBy = validSorts.includes(req.query.sort) ? req.query.sort : 'department';
    const facultyList = await getSortedFaculty(sortBy);
    
    res.render('faculty/list', {
        title: 'Faculty Directory',
        faculty: facultyList,
        currentSort: sortBy
    });
};

// Route handler for looking up individual faculty
const facultyDetailPage = async (req, res, next) => {
    const facultySlug = req.params.facultySlug;
    const facultyMem = await getFacultyBySlug(facultySlug);

    if (Object.keys(facultyMem).length === 0) {
        const err = new Error(`Faculty member ${facultySlug} not found`);
        err.status = 404;
        return next(err);
    }

    res.render('faculty/detail', {
        title: `${facultyMem.name} - ${facultyMem.title}`,
        faculty: facultyMem
    });
};

export { facultyListPage, facultyDetailPage };