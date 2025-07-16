const { Notes, User, Course } = require("../model");
const { createActivityLog } = require('./activitylogController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/notes/';
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Allow only specific file types
    const allowedTypes = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.txt', '.jpg', '.jpeg', '.png'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(fileExtension)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, DOC, DOCX, PPT, PPTX, TXT, JPG, JPEG, PNG files are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: fileFilter
});

// Faculty and Admin can upload notes
const uploadNotes = async (req, res) => {
    try {
        const { title, description, courseId, tags } = req.body;
        const uploadedBy = req.user.id;

        if (!title || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Please provide title and course ID!"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a file!"
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

        // Faculty can only upload to their own courses
        if (req.user.role === 'faculty' && course.facultyId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You can only upload notes to your own courses!"
            });
        }

        const newNotes = await Notes.create({
            title,
            description,
            fileName: req.file.originalname,
            filePath: req.file.path,
            fileType: path.extname(req.file.originalname).toLowerCase(),
            fileSize: req.file.size,
            uploadedBy,
            courseId,
            tags: tags || null
        });

        // Get notes with uploader and course details
        const notesWithDetails = await Notes.findByPk(newNotes.id, {
            include: [
                {
                    model: User,
                    as: 'uploader',
                    attributes: ['username']
                },
                {
                    model: Course,
                    as: 'course',
                    attributes: ['title', 'code']
                }
            ]
        });

        // Log activity
        await createActivityLog(
            uploadedBy, 
            'uploaded', 
            'notes', 
            newNotes.id, 
            `Uploaded notes: ${title}`, 
            req
        );

        // Format response
        const formattedNotes = {
            title: notesWithDetails.title,
            description: notesWithDetails.description,
            fileName: notesWithDetails.fileName,
            fileType: notesWithDetails.fileType,
            fileSize: notesWithDetails.fileSize,
            uploadedBy: notesWithDetails.uploader.username,
            course: notesWithDetails.course.title,
            courseCode: notesWithDetails.course.code,
            tags: notesWithDetails.tags,
            uploadedAt: notesWithDetails.created_at
        };

        return res.status(201).json({
            success: true,
            message: "Notes uploaded successfully!",
            notes: formattedNotes
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error uploading notes",
            error: error.message
        });
    }
};

// Get all notes (Everyone can see all notes)
const getAllNotes = async (req, res) => {
    try {
        const notes = await Notes.findAll({
            include: [
                {
                    model: User,
                    as: 'uploader',
                    attributes: ['username']
                },
                {
                    model: Course,
                    as: 'course',
                    attributes: ['title', 'code']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        // Format response
        const formattedNotes = notes.map(note => ({
            id: note.id,
            title: note.title,
            description: note.description,
            fileName: note.fileName,
            fileType: note.fileType,
            fileSize: note.fileSize,
            downloadCount: note.downloadCount,
            uploadedBy: note.uploader.username,
            course: note.course.title,
            courseCode: note.course.code,
            tags: note.tags,
            uploadedAt: note.created_at
        }));

        return res.status(200).json({
            success: true,
            message: "All notes retrieved successfully",
            notes: formattedNotes
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching notes",
            error: error.message
        });
    }
};

// Get notes by course (Everyone can see, filtered by course)
const getCourseNotes = async (req, res) => {
    try {
        const courseId = req.params.courseId;

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

        const notes = await Notes.findAll({
            where: { courseId: courseId },
            include: [
                {
                    model: User,
                    as: 'uploader',
                    attributes: ['username']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        // Format response
        const formattedNotes = notes.map(note => ({
            id: note.id,
            title: note.title,
            description: note.description,
            fileName: note.fileName,
            fileType: note.fileType,
            fileSize: note.fileSize,
            downloadCount: note.downloadCount,
            uploadedBy: note.uploader.username,
            course: course.title,
            courseCode: course.code,
            tags: note.tags,
            uploadedAt: note.created_at
        }));

        return res.status(200).json({
            success: true,
            message: "Course notes retrieved successfully",
            notes: formattedNotes
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching course notes",
            error: error.message
        });
    }
};

// Get notes uploaded by the logged-in faculty/admin
const getMyNotes = async (req, res) => {
    try {
        const uploadedBy = req.user.id;

        const notes = await Notes.findAll({
            where: { uploadedBy: uploadedBy },
            include: [
                {
                    model: Course,
                    as: 'course',
                    attributes: ['title', 'code']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        // Format response
        const formattedNotes = notes.map(note => ({
            id: note.id,
            title: note.title,
            description: note.description,
            fileName: note.fileName,
            fileType: note.fileType,
            fileSize: note.fileSize,
            downloadCount: note.downloadCount,
            course: note.course.title,
            courseCode: note.course.code,
            tags: note.tags,
            uploadedAt: note.created_at
        }));

        return res.status(200).json({
            success: true,
            message: "Your notes retrieved successfully",
            notes: formattedNotes
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching your notes",
            error: error.message
        });
    }
};

// Download notes file
const downloadNotes = async (req, res) => {
    try {
        const notesId = req.params.id;

        const notes = await Notes.findByPk(notesId);

        if (!notes) {
            return res.status(404).json({
                success: false,
                message: "Notes not found!"
            });
        }

        // Check if file exists
        if (!fs.existsSync(notes.filePath)) {
            return res.status(404).json({
                success: false,
                message: "File not found on server!"
            });
        }

        // Increment download count
        await notes.update({ 
            downloadCount: notes.downloadCount + 1 
        });

        // Log activity
        await createActivityLog(
            req.user.id, 
            'downloaded', 
            'notes', 
            notesId, 
            `Downloaded notes: ${notes.fileName}`, 
            req
        );

        // Send file
        res.download(notes.filePath, notes.fileName);

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error downloading notes",
            error: error.message
        });
    }
};

// Faculty/Admin can update their own notes
const updateNotes = async (req, res) => {
    try {
        const notesId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;
        const { title, description, tags } = req.body;

        const notes = await Notes.findByPk(notesId);

        if (!notes) {
            return res.status(404).json({
                success: false,
                message: "Notes not found"
            });
        }

        // Only uploader or admin can update
        if (userRole !== 'admin' && notes.uploadedBy !== userId) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to update these notes"
            });
        }

        await notes.update({
            title: title || notes.title,
            description: description || notes.description,
            tags: tags !== undefined ? tags : notes.tags
        });

        // Log activity
        await createActivityLog(
            userId, 
            'updated', 
            'notes', 
            notesId, 
            `Updated notes: ${notes.title}`, 
            req
        );

        return res.status(200).json({
            success: true,
            message: "Notes updated successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating notes",
            error: error.message
        });
    }
};

// Faculty/Admin can delete their own notes
const deleteNotes = async (req, res) => {
    try {
        const notesId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;

        const notes = await Notes.findByPk(notesId);

        if (!notes) {
            return res.status(404).json({
                success: false,
                message: "Notes not found"
            });
        }

        // Only uploader or admin can delete
        if (userRole !== 'admin' && notes.uploadedBy !== userId) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to delete these notes"
            });
        }

        // Delete file from filesystem
        if (fs.existsSync(notes.filePath)) {
            fs.unlinkSync(notes.filePath);
        }

        // Delete from database
        await notes.destroy();

        // Log activity
        await createActivityLog(
            userId, 
            'deleted', 
            'notes', 
            notesId, 
            `Deleted notes: ${notes.title}`, 
            req
        );

        return res.status(200).json({
            success: true,
            message: "Notes deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error deleting notes",
            error: error.message
        });
    }
};

module.exports = {
    upload,
    uploadNotes,
    getAllNotes,
    getCourseNotes,
    getMyNotes,
    downloadNotes,
    updateNotes,
    deleteNotes
};