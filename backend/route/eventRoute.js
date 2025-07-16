const router = require("express").Router();
const {
    createEvent,
    getAllEvents,
    getCourseEvents,
    getMyEvents,
    getEventById,
    updateEvent,
    deleteEvent
} = require("../controller/eventController");
const authGuard = require("../middleware/authGuard");
const isFacultyorAdmin = require("../middleware/isFacutlyorAdmin");

// Routes for ALL authenticated users (Students, Faculty, Admin can see events)
router.get("/all", authGuard, getAllEvents);                    // Get all events
router.get("/course/:courseId", authGuard, getCourseEvents);    // Get events by course
router.get("/event/:id", authGuard, getEventById);                   // Get single event

// Routes for Faculty and Admin only (CRUD operations)
router.post("/create", authGuard, isFacultyorAdmin, createEvent);           // Create event
router.get("/my-events", authGuard, isFacultyorAdmin, getMyEvents);         // Get own events
router.put("/update/:id", authGuard, isFacultyorAdmin, updateEvent);        // Update event
router.delete("/delete/:id", authGuard, isFacultyorAdmin, deleteEvent);     // Delete event

module.exports = router;