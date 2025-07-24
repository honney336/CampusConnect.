const router = require("express").Router(); 
const {createAnnouncement,getAllAnnouncements,getCourseAnnouncements,getMyAnnouncements,getAnnouncementById,updateAnnouncement,deleteAnnouncement} =require("../controller/announcementController");

// const router = require("express").Router();
// const {
//     createAnnouncement,
//     getAllAnnouncements,
//     getCourseAnnouncements,
//     getMyAnnouncements,
//     getAnnouncementById,
//     updateAnnouncement,
//     deleteAnnouncement
// } = require("../controller/announcementController");
const authGuard = require("../middleware/authGuard");
const isFacultyorAdmin = require("../middleware/isFacutlyorAdmin");

// Routes for ALL authenticated users (Students, Faculty, Admin can see all announcements)
router.get("/all", getAllAnnouncements);                    // Get all announcements
router.get("/course/:courseId", authGuard, getCourseAnnouncements);    // Get announcements by course
router.get("/:id", authGuard, getAnnouncementById);               // Get single announcement

// Routes for Faculty and Admin only (CRUD operations)
router.post("/create", authGuard, isFacultyorAdmin, createAnnouncement );           // Create announcement
router.get("/my-announcements", authGuard, isFacultyorAdmin, getMyAnnouncements);  // Get own announcements
router.put("/update/:id", authGuard, isFacultyorAdmin, updateAnnouncement);        // Update announcement
router.delete("/delete/:id", authGuard, isFacultyorAdmin, deleteAnnouncement);     // Delete announcement

module.exports = router;

