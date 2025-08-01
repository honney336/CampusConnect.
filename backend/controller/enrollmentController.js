const { User, Course, Enrollment } = require("../model");
const { createActivityLog } = require("./activitylogController"); // Add this import

// Admin can enroll student in course
const enrollStudent = async (req, res) => {
    try {
        const { studentEmail, courseCode } = req.body;

        if (!studentEmail || !courseCode) {
            return res.status(400).json({
                success: false,
                message: "Please provide both student email and course code!"
            });
        }

        // Find student by email
        const student = await User.findOne({
            where: { 
                email: studentEmail,
                role: 'student'
            }
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found with this email!"
            });
        }

        // Find course by code
        const course = await Course.findOne({
            where: { 
                code: courseCode,
                isActive: true 
            }
        });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found or inactive!"
            });
        }

        // Check if student is already enrolled
        const existingEnrollment = await Enrollment.findOne({
            where: {
                studentId: student.id,
                courseId: course.id
            }
        });

        if (existingEnrollment) {
            return res.status(409).json({
                success: false,
                message: "Student is already enrolled in this course!"
            });
        }

        const newEnrollment = await Enrollment.create({
            studentId: student.id,
            courseId: course.id
        });

        // Get enrollment with related data
        const enrollmentWithDetails = await Enrollment.findByPk(newEnrollment.id, {
            include: [
                {
                    model: User,
                    as: 'student',
                    attributes: ['id', 'username', 'email']
                },
                {
                    model: Course,
                    as: 'course',
                    attributes: ['id', 'title', 'code']
                }
            ]
        });

        return res.status(201).json({
            success: true,
            message: "Student enrolled successfully!",
            enrollment: enrollmentWithDetails
        });

    } catch (error) {
        console.error('Enrollment error:', error);
        return res.status(500).json({
            success: false,
            message: "Error enrolling student",
            error: error.message
        });
    }
};

// Get all enrollments (Admin only)
const getAllEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.findAll({
            include: [
                {
                    model: User,
                    as: 'student',
                    attributes: ['id', 'username', 'email']
                },
                {
                    model: Course,
                    as: 'course',
                    attributes: ['id', 'title', 'code', 'credit', 'semester'],
                    include: [{
                        model: User,
                        as: 'faculty',
                        attributes: ['id', 'username', 'email']
                    }]
                }
            ],
            order: [['enrolledAt', 'DESC']]
        });

        return res.status(200).json({
            success: true,
            message: "Enrollments retrieved successfully",
            enrollments: enrollments
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching enrollments",
            error: error.message
        });
    }
};


// Get student's own enrollments (Student only)
const getStudentEnrollments = async (req, res) => {
  try {
    const studentId = req.user.id;
    console.log('Fetching enrollments for student:', studentId);

    // First check if student exists
    const student = await User.findByPk(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const enrollments = await Enrollment.findAll({
      where: { studentId: studentId },
      include: [
        {
          model: Course,
          as: "course",
          where: { isActive: true },
          attributes: [
            "title",
            "description", 
            "credit",
            "code",
            "semester",
          ],
          include: [
            {
              model: User,
              as: "faculty",
              attributes: ["username"],
            },
          ],
        },
      ],
      order: [["enrolledAt", "DESC"]],
    });

    // Create activity log
    await createActivityLog(
      studentId,
      'viewed',
      'enrollments',
      null,
      'Viewed enrollments',
      req
    );

    return res.status(200).json({
      success: true,
      message: "Student enrollments retrieved successfully",
      enrollments: enrollments.map(enrollment => ({
        id: enrollment.id,
        title: enrollment.course.title,
        description: enrollment.course.description,
        credit: enrollment.course.credit,
        code: enrollment.course.code,
        semester: enrollment.course.semester,
        faculty: enrollment.course.faculty.username,
        enrolledAt: enrollment.enrolledAt
      }))
    });

  } catch (error) {
    console.error('Enrollment error:', error);
    return res.status(500).json({
      success: false,
      message: "Error fetching student enrollments",
      error: error.message
    });
  }
};

// Get enrollments by course (Faculty can see their course enrollments)
const getCourseEnrollments = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const userId = req.user.id;
        const userRole = req.user.role;

        // Check if course exists
        const course = await Course.findOne({
            where: { 
                id: courseId,
                isActive: true 
            }
        });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found!"
            });
        }

        // Faculty can only see their own course enrollments
        if (userRole === 'faculty' && course.facultyId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to view this course's enrollments"
            });
        }

        

        const enrollments = await Enrollment.findAll({
            where: { courseId: courseId },
            include: [
                {
                    model: User,
                    as: 'student',
                    attributes: ['id', 'username', 'email']
                }
            ],
            order: [['enrolledAt', 'DESC']]
        });

        return res.status(200).json({
            success: true,
            message: "Course enrollments retrieved successfully",
            course: {
                id: course.id,
                title: course.title,
                code: course.code
            },
            enrollments: enrollments
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching course enrollments",
            error: error.message
        });
    }
};

// Admin can remove student from course
const removeEnrollment = async (req, res) => {
    try {
        const enrollmentId = req.params.id;

        const enrollment = await Enrollment.findByPk(enrollmentId, {
            include: [
                {
                    model: User,
                    as: 'student',
                    attributes: ['id', 'username', 'email']
                },
                {
                    model: Course,
                    as: 'course',
                    attributes: ['id', 'title', 'code']
                }
            ]
        });

        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: "Enrollment not found!"
            });
        }

        await enrollment.destroy();

        return res.status(200).json({
            success: true,
            message: "Student removed from course successfully",
            removedEnrollment: enrollment
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error removing enrollment",
            error: error.message
        });
    }
};

module.exports = {
    enrollStudent,
    getAllEnrollments,
    getStudentEnrollments,
    getCourseEnrollments,
    removeEnrollment
};