const router = require("express").Router();
const {
    upload,
    uploadNotes,
    getAllNotes,
    getCourseNotes,
    getMyNotes,
    downloadNotes,
    updateNotes,
    deleteNotes
} = require("../controller/notesController");
const authGuard = require("../middleware/authGuard");
const isFacultyorAdmin = require("../middleware/isFacutlyorAdmin");

// Routes for ALL authenticated users (Students, Faculty, Admin can view notes)
router.get("/all", authGuard, getAllNotes);                        // Get all notes
router.get("/course/:courseId", authGuard, getCourseNotes);        // Get notes by course
router.get("/download/:id", authGuard, downloadNotes);             // Download notes file

// Routes for Faculty and Admin only (CRUD operations)
router.post("/upload", authGuard, isFacultyorAdmin, upload.single('file'), uploadNotes);  // Upload notes
router.get("/my-notes", authGuard, isFacultyorAdmin, getMyNotes);                         // Get own notes
router.put("/update/:id", authGuard, isFacultyorAdmin, updateNotes);                      // Update notes
router.delete("/delete/:id", authGuard, isFacultyorAdmin, deleteNotes);                   // Delete notes

module.exports = router;