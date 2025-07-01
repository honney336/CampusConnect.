const router = require("express").Router(); 
const {enrollStudent, getStudentEnrollments,getCourseEnrollments } = require("../controller/enrollmentController");
const authGuard = require("../middleware/authGuard");
const isAdmin = require("../middleware/isAdmin");
const isStudent = require("../middleware/isStudent");
const isFacultyOrAdmin= require("../middleware/isFacutlyorAdmin");

router.post("/enroll", authGuard,isAdmin,enrollStudent);
router.get("/enrollments", authGuard,isStudent,getStudentEnrollments);
router.get("/course-enrollments/:courseId", authGuard,isFacultyOrAdmin,getCourseEnrollments);

module.exports=router; 