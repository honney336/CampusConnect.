const {Course, User, Enrollment} = require("../model"); // Assuming you have models defined for Course, User, and Enrollment
    const {createActivityLog}=require("./activitylogController")
    // Faculty can create new course
    const createCourse = async (req, res) => {
        console.log(req.body);
        
        try {
            const { title, description, code, credit, semester } = req.body;
            const facultyId = req.user.id;

            if (!title || !description || !code || !credit || !semester) {
                return res.status(400).json({
                    success: false, 
                    message: "Please provide all required fields!"
                });
            }

            // Check if course code already exists
            const existingCourse = await Course.findOne({ where: { code: code } });
            if (existingCourse) {
                return res.status(409).json({
                    success: false, 
                    message: "Course code already exists!"
                });
            }

            const newCourse = await Course.create({
                title,
                description,
                code,
                credit,
                semester,
                facultyId
            });
            await createActivityLog(facultyId, 'created', 'course', newCourse.id, `Created course: ${title} (${code})`, req);
            return res.status(201).json({
                success: true,
                message: "Course created successfully!",
                course: newCourse
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message
            });
        }
};

// Get all courses (accessible to all authenticated users)
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.findAll({
            where: { isActive: true },
            include: [{
                model: User,
                as: 'faculty',
                attributes: ['id', 'username', 'email']
            }]
        });

        return res.status(200).json({
            success: true,
            message: "Courses retrieved successfully",
            courses: courses
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching courses",
            error: error.message
        });
    }
};

// Get courses by faculty (faculty can see their own courses)
const getCoursesByFaculty = async (req, res) => {
    try {
        const facultyId = req.user.id;

        const courses = await Course.findAll({
            where: { 
                facultyId: facultyId,
                isActive: true 
            },
            include: [{
                model: Enrollment,
                as: 'enrollments',
                include: [{
                    model: User,
                    as: 'student',
                    attributes: ['id', 'username', 'email']
                }]
            }]
        });

        return res.status(200).json({
            success: true,
            message: "Faculty courses retrieved successfully",
            courses: courses
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching faculty courses",
            error: error.message
        });
    }
};

// Get single course by ID
const getCourseById = async (req, res) => {
    try {
        const courseId = req.params.id;

        const course = await Course.findOne({
            where: { 
                id: courseId,
                isActive: true 
            },
            include: [
                {
                    model: User,
                    as: 'faculty',
                    attributes: ['id', 'username', 'email']
                },
                {
                    model: Enrollment,
                    as: 'enrollments',
                    include: [{
                        model: User,
                        as: 'student',
                        attributes: ['id', 'username', 'email']
                    }]
                }
            ]
        });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Course retrieved successfully",
            course: course
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching course",
            error: error.message
        });
    }
};

// Faculty can update their own course
const updateCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;
        const { title, description, code, credit, semester } = req.body;

        // Find course without faculty check first
        const course = await Course.findOne({
            where: { 
                id: courseId,
                isActive: true 
            }
        });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Check permissions - allow both admin and course creator
        if (userRole !== 'admin' && course.facultyId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to update this course"
            });
        }

        // Check if new code conflicts with existing courses (excluding current)
        if (code && code !== course.code) {
            const existingCourse = await Course.findOne({ 
                where: { 
                    code: code,
                    id: { [require('sequelize').Op.ne]: courseId }
                } 
            });
            if (existingCourse) {
                return res.status(409).json({
                    success: false,
                    message: "Course code already exists!"
                });
            }
        }

        await course.update({
            title: title || course.title,
            description: description || course.description,
            code: code || course.code,
            credit: credit || course.credit,
            semester: semester || course.semester
        });
        await createActivityLog(userId, 'updated', 'course', courseId, `Updated course: ${course.title}`, req);
        return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            course: course
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating course",
            error: error.message
        });
    }
};

// Faculty can delete their own course (soft delete)
const deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;

        // Find course without faculty check first
        const course = await Course.findOne({
            where: { 
                id: courseId,
                isActive: true 
            }
        });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Check permissions - allow both admin and course creator
        if (userRole !== 'admin' && course.facultyId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to delete this course"
            });
        }

        await course.update({ isActive: false });

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        });

    } catch (error) {const {Course, User, Enrollment} = require("../model"); // Assuming you have models defined for Course, User, and Enrollment
    const {createActivityLog}=require("./activitylogController")
    // Faculty can create new course
    const createCourse = async (req, res) => {
        console.log(req.body);
        
        try {
            const { title, description, code, credit, semester } = req.body;
            const facultyId = req.user.id;

            if (!title || !description || !code || !credit || !semester) {
                return res.status(400).json({
                    success: false, 
                    message: "Please provide all required fields!"
                });
            }

            // Check if course code already exists
            const existingCourse = await Course.findOne({ where: { code: code } });
            if (existingCourse) {
                return res.status(409).json({
                    success: false, 
                    message: "Course code already exists!"
                });
            }

            const newCourse = await Course.create({
                title,
                description,
                code,
                credit,
                semester,
                facultyId
            });
            await createActivityLog(facultyId, 'created', 'course', newCourse.id, `Created course: ${title} (${code})`, req);
            return res.status(201).json({
                success: true,
                message: "Course created successfully!",
                course: newCourse
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message
            });
        }
};

// Get all courses (accessible to all authenticated users)
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.findAll({
            where: { isActive: true },
            include: [{
                model: User,
                as: 'faculty',
                attributes: ['id', 'username', 'email']
            }]
        });

        return res.status(200).json({
            success: true,
            message: "Courses retrieved successfully",
            courses: courses
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching courses",
            error: error.message
        });
    }
};

// Get courses by faculty (faculty can see their own courses)
const getCoursesByFaculty = async (req, res) => {
    try {
        const facultyId = req.user.id;

        const courses = await Course.findAll({
            where: { 
                facultyId: facultyId,
                isActive: true 
            },
            include: [{
                model: Enrollment,
                as: 'enrollments',
                include: [{
                    model: User,
                    as: 'student',
                    attributes: ['id', 'username', 'email']
                }]
            }]
        });

        return res.status(200).json({
            success: true,
            message: "Faculty courses retrieved successfully",
            courses: courses
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching faculty courses",
            error: error.message
        });
    }
};

// Get single course by ID
const getCourseById = async (req, res) => {
    try {
        const courseId = req.params.id;

        const course = await Course.findOne({
            where: { 
                id: courseId,
                isActive: true 
            },
            include: [
                {
                    model: User,
                    as: 'faculty',
                    attributes: ['id', 'username', 'email']
                },
                {
                    model: Enrollment,
                    as: 'enrollments',
                    include: [{
                        model: User,
                        as: 'student',
                        attributes: ['id', 'username', 'email']
                    }]
                }
            ]
        });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Course retrieved successfully",
            course: course
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching course",
            error: error.message
        });
    }
};

// Faculty can update their own course
const updateCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;
        const { title, description, code, credit, semester } = req.body;

        // Find course without faculty check first
        const course = await Course.findOne({
            where: { 
                id: courseId,
                isActive: true 
            }
        });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Check permissions - allow both admin and course creator
        if (userRole !== 'admin' && course.facultyId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to update this course"
            });
        }

        // Check if new code conflicts with existing courses (excluding current)
        if (code && code !== course.code) {
            const existingCourse = await Course.findOne({ 
                where: { 
                    code: code,
                    id: { [require('sequelize').Op.ne]: courseId }
                } 
            });
            if (existingCourse) {
                return res.status(409).json({
                    success: false,
                    message: "Course code already exists!"
                });
            }
        }

        await course.update({
            title: title || course.title,
            description: description || course.description,
            code: code || course.code,
            credit: credit || course.credit,
            semester: semester || course.semester
        });
        await createActivityLog(userId, 'updated', 'course', courseId, `Updated course: ${course.title}`, req);
        return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            course: course
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating course",
            error: error.message
        });
    }
};

// Faculty can delete their own course (soft delete)
const deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;

        // Find course without faculty check first
        const course = await Course.findOne({
            where: { 
                id: courseId,
                isActive: true 
            }
        });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Check permissions - allow both admin and course creator
        if (userRole !== 'admin' && course.facultyId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to delete this course"
            });
        }

        await course.update({ isActive: false });

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error deleting course",
            error: error.message
        });
    }
};

module.exports = {
    createCourse,
    getAllCourses,
    getCoursesByFaculty,
    getCourseById,
    updateCourse,
    deleteCourse
};
        return res.status(500).json({
            success: false,
            message: "Error deleting course",
            error: error.message
        });
    }
};

module.exports = {
    createCourse,
    getAllCourses,
    getCoursesByFaculty,
    getCourseById,
    updateCourse,
    deleteCourse
};