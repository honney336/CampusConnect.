const { User, Course, Enrollment } = require("../model");
// Admin can enroll student in course
const enrollStudent = async (req, res) => {
    console.log(req.body);
    
    try {
        const { studentId, courseId } = req.body;

        if (!studentId || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Please provide both student ID and course ID!"
            });
        }

        // Check if student exists and has student role
        const student = await User.findOne({
            where: { 
                id: studentId,
                role: 'student'
            }
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found!"
            });
        }

        // Check if course exists and is active
        const course = await Course.findOne({
            where: { 
                id: courseId,
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
                studentId: studentId,
                courseId: courseId
            }
        });

        if (existingEnrollment) {
            return res.status(409).json({
                success: false,
                message: "Student is already enrolled in this course!"
            });
        }

        const newEnrollment = await Enrollment.create({
            studentId,
            courseId
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
                    attributes: ['id', 'title', 'code', 'credit']
                }
            ]
        });

        return res.status(201).json({
            success: true,
            message: "Student enrolled successfully!",
            enrollment: enrollmentWithDetails
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
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
            order: [['createdAt', 'DESC']]
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

// const getStudentEnrollments = async (req, res) => {
//   try {
//     // Since isStudent middleware ensures only students can access this route,
//     // we can directly use req.user.id as the studentId
//     const studentId = req.user.id;

//     const enrollments = await Enrollment.findAll({
//       where: { studentId: studentId },
//       include: [
//         {
//           model: Course,
//           as: "course",
//           where: { isActive: true },
//           attributes: [
//             "id",
//             "title",
//             "code",
//             "credit",
//             "semester",
//             "description",
//           ],
//           include: [
//             {
//               model: User,
//               as: "faculty",
//               attributes: ["id", "username", "email"],
//             },
//           ],
//         },
//       ],
//       order: [["enrolledAt", "DESC"]],
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Student enrollments retrieved successfully",
//       enrollments: enrollments,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Error fetching student enrollments",
//       error: error.message,
//     });
//   }
// };

// Get student's own enrollments (Student only)
const getStudentEnrollments = async (req, res) => {
  try {
    const studentId = req.user.id;

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
      attributes: [], // Don't include enrollment fields
      order: [["enrolledAt", "DESC"]],
    });

    // Transform the data to flatten the structure
    const simplifiedEnrollments = enrollments.map(enrollment => ({
      title: enrollment.course.title,
      description: enrollment.course.description,
      credit: enrollment.course.credit,
      code: enrollment.course.code,
      semester: enrollment.course.semester,
      CreatedBy: enrollment.course.faculty.username,
    }));

    return res.status(200).json({
      success: true,
      message: "Student enrollments retrieved successfully",
      enrollments: simplifiedEnrollments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching student enrollments",
      error: error.message,
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