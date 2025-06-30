const router = require("express").Router(); 
const { get } = require("http");
const {createCourse, getAllCourses, getCoursesByFaculty, getCourseById, deleteCourse , updateCourse} = require("../controller/courseController");
const authGuard = require("../middleware/authGuard");
const isFacultyorAdmin = require("../middleware/isFacutlyorAdmin");

router.post("/createcourse", authGuard,isFacultyorAdmin,createCourse); // Faculty can create a course
router.get("/allcourses", authGuard,getAllCourses); // Get all courses (accessible to all authenticated users)
router.get("/facultycourses", authGuard, isFacultyorAdmin,getCoursesByFaculty); // Get courses by faculty
router.get("/course/:id", authGuard, getCourseById); // Get course by ID (accessible to all authenticated users)
router.delete("/deletecourse/:id", authGuard, isFacultyorAdmin, deleteCourse); // Delete course (accessible to faculty or admin)
router.put("/updatecourse/:id", authGuard, isFacultyorAdmin, updateCourse); // Update course (accessible to faculty or admin)
module.exports = router;

