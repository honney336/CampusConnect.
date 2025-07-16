const { Announcement, User, Course } = require("../model");

// Faculty and Admin can create announcements
const createAnnouncement = async (req, res) => {
    console.log(req.body);
    
    try {
        const { title, content, announcementType, courseId } = req.body;
        const createdBy = req.user.id;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Please provide title and content!"
            });
        }

        // If courseId is provided, just verify the course exists
        if (courseId) {
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
        }

        const newAnnouncement = await Announcement.create({
            title,
            content,
            announcementType: announcementType || 'general',
            createdBy,
            courseId: courseId || null
        });

        // Get announcement with creator and course details
        const announcementWithDetails = await Announcement.findByPk(newAnnouncement.id, {
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'username', 'role']
                },
                {
                    model: Course,
                    as: 'course',
                    attributes: ['id', 'title', 'code'],
                    required: false
                }
            ]
        });

        return res.status(201).json({
            success: true,
            message: "Announcement created successfully!",
            announcement: announcementWithDetails
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get all announcements (Everyone can see all announcements)
const getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.findAll({
            where: { isActive: true },
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'username', 'role']
                },
                {
                    model: Course,
                    as: 'course',
                    attributes: ['id', 'title', 'code'],
                    required: false
                }
            ],
            order: [['created_At', 'DESC']]
        });

        return res.status(200).json({
            success: true,
            message: "All announcements retrieved successfully",
            announcements: announcements
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching announcements",
            error: error.message
        });
    }
};

// Get announcements by course (Everyone can see, just filtered by course)
const getCourseAnnouncements = async (req, res) => {
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

        const announcements = await Announcement.findAll({
            where: { 
                courseId: courseId,
                isActive: true 
            },
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'username', 'role']
                }
            ],
            order: [['created_At', 'DESC']]
        });
        
        return res.status(200).json({
            success: true,
            message: "Course announcements retrieved successfully",
            course: {
                id: course.id,
                title: course.title,
                code: course.code
            },
            announcements: announcements
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching course announcements",
            error: error.message
        });
    }
};

// Get announcements created by the logged-in faculty/admin
const getMyAnnouncements = async (req, res) => {
    try {
        const createdBy = req.user.id;

        const announcements = await Announcement.findAll({
            where: { 
                createdBy: createdBy,
                isActive: true 
            },
            include: [
                {
                    model: Course,
                    as: 'course',
                    attributes: ['id', 'title', 'code'],
                    required: false
                }
            ],
            order: [['created_At', 'DESC']]
        });

        return res.status(200).json({
            success: true,
            message: "Your announcements retrieved successfully",
            announcements: announcements
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching your announcements",
            error: error.message
        });
    }
};

// Get single announcement by ID (Everyone can see)
const getAnnouncementById = async (req, res) => {
    try {
        const announcementId = req.params.id;

        const announcement = await Announcement.findOne({
            where: { 
                id: announcementId,
                isActive: true 
            },
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'username', 'email', 'role']
                },
                {
                    model: Course,
                    as: 'course',
                    attributes: ['id', 'title', 'code'],
                    required: false
                }
            ]
        });

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: "Announcement not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Announcement retrieved successfully",
            announcement: announcement
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching announcement",
            error: error.message
        });
    }
};
  

// Faculty/Admin can update their own announcements
const updateAnnouncement = async (req, res) => {
    try {
        const announcementId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;
        const { title, content, announcementType, courseId } = req.body;

        const announcement = await Announcement.findOne({
            where: { 
                id: announcementId,
                isActive: true 
            }
        });

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: "Announcement not found"
            });
        }

        // Only creator or admin can update
        if (userRole !== 'admin' && announcement.createdBy !== userId) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to update this announcement"
            });
        }

        // If courseId is being updated, just verify the course exists (no ownership restriction)
        if (courseId && courseId !== announcement.courseId) {
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
        }

        await announcement.update({
            title: title || announcement.title,
            content: content || announcement.content,
            announcementType: announcementType || announcement.announcementType,
            courseId: courseId !== undefined ? courseId : announcement.courseId
        });

        // Get updated announcement with details
        const updatedAnnouncement = await Announcement.findByPk(announcementId, {
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'username', 'role']
                },
                {
                    model: Course,
                    as: 'course',
                    attributes: ['id', 'title', 'code'],
                    required: false
                }
            ]
        });

        return res.status(200).json({
            success: true,
            message: "Announcement updated successfully",
            announcement: updatedAnnouncement
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating announcement",
            error: error.message
        });
    }
};

// Faculty/Admin can delete their own announcements (soft delete)
const deleteAnnouncement = async (req, res) => {
    try {
        const announcementId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;

        const announcement = await Announcement.findOne({
            where: { 
                id: announcementId,
                isActive: true 
            }
        });

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: "Announcement not found"
            });
        }

        // Only creator or admin can delete
        if (userRole !== 'admin' && announcement.createdBy !== userId) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to delete this announcement"
            });
        }

        await announcement.update({ isActive: false });

        return res.status(200).json({
            success: true,
            message: "Announcement deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error deleting announcement",
            error: error.message
        });
    }
};

module.exports = {
    createAnnouncement,
    getAllAnnouncements,
    getCourseAnnouncements,
    getMyAnnouncements,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement
};