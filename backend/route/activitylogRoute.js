const router = require("express").Router();
const {
    getAllActivityLogs,
    getUserActivityLogs,
    getActivityLogsByEntityType,
    getMyActivityLogs,
    getActivityLogStats,
    deleteOldActivityLogs
} = require("../controller/activitylogController");
const authGuard = require("../middleware/authGuard");
const isAdmin = require("../middleware/isAdmin");

// Routes for authenticated users
router.get("/my-logs", authGuard, getMyActivityLogs);                    // Users can see their own logs

// Routes for Admin only
router.get("/all", authGuard, isAdmin, getAllActivityLogs);             // Get all activity logs
router.get("/user/:userId", authGuard, isAdmin, getUserActivityLogs);   // Get logs by user
router.get("/entity/:entityType", authGuard, isAdmin, getActivityLogsByEntityType); // Get logs by entity type
router.get("/stats", authGuard, isAdmin, getActivityLogStats);          // Get activity statistics
router.delete("/cleanup", authGuard, isAdmin, deleteOldActivityLogs);   // Delete old logs

module.exports = router;