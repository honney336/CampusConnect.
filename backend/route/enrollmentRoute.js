const router = require("express").Router(); 
const {enrollStudent, getStudentEnrollments,getCourseEnrollments,removeEnrollment, getAllEnrollments} = require("../controller/enrollmentController");
const authGuard = require("../middleware/authGuard");
const isAdmin = require("../middleware/isAdmin");
const isStudent = require("../middleware/isStudent");
const isFacultyOrAdmin= require("../middleware/isFacutlyorAdmin");

router.post("/enroll", authGuard,isAdmin,enrollStudent);
router.get("/enrollments", authGuard,isStudent,getStudentEnrollments);
router.get("/course-enrollments/:courseId", authGuard,isFacultyOrAdmin,getCourseEnrollments);
router.delete("/remove-enrollment/:id", authGuard,isAdmin,removeEnrollment);
router.get("/all-enrollments", authGuard,isAdmin,getAllEnrollments);

module.exports=router; 