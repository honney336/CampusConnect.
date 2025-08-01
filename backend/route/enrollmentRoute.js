const router = require("express").Router(); 
const {enrollStudent, getStudentEnrollments,getCourseEnrollments,removeEnrollment, getAllEnrollments} = require("../controller/enrollmentController");
const authGuard = require("../middleware/authGuard");
const isAdmin = require("../middleware/isAdmin");
const isStudent = require("../middleware/isStudent");
const isFacultyOrAdmin= require("../middleware/isFacutlyorAdmin");

router.get("/enrollments", authGuard, getStudentEnrollments);
router.get("/all-enrollments", authGuard, isAdmin, getAllEnrollments);
router.post("/enroll", authGuard, isAdmin, enrollStudent);
router.get("/course-enrollments/:courseId", authGuard, isFacultyOrAdmin, getCourseEnrollments);
router.delete("/remove-enrollment/:id", authGuard, isAdmin, removeEnrollment);

module.exports=router;