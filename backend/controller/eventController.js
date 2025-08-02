const { Event, User, Course } = require("../model");

// Faculty and Admin can create events
const createEvent = async (req, res) => {
    console.log(req.body);
    
    try {
        const { title, description, eventType, eventDate, courseId, priority } = req.body;
        const createdBy = req.user.id;

        if (!title || !eventType || !eventDate) {
            return res.status(400).json({
                success: false,
                message: "Please provide title, event type, and event date!"
            });
        }

        // Validate event date is not in the past
        const eventDateTime = new Date(eventDate);
        if (eventDateTime < new Date()) {
            return res.status(400).json({
                success: false,
                message: "Event date cannot be in the past!"
            });
        }

        // If courseId is provided, verify the course exists
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

        const newEvent = await Event.create({
            title,
            description,
            eventType,
            eventDate: eventDateTime,
            createdBy,
            courseId: courseId || null,
            priority: priority || 'medium'
        });

        // Get event with creator and course details
        const eventWithDetails = await Event.findByPk(newEvent.id, {
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['username']
                },
                {
                    model: Course,
                    as: 'course',
                    attributes: ['title'],
                    required: false
                }
            ]
        });

        // Format response
        const formattedEvent = {
            title: eventWithDetails.title,
            description: eventWithDetails.description,
            eventType: eventWithDetails.eventType,
            priority: eventWithDetails.priority,
            eventDate: eventWithDetails.eventDate,
            creator: eventWithDetails.creator.username,
            ...(eventWithDetails.course && { course: eventWithDetails.course.title })
        };

        return res.status(201).json({
            success: true,
            message: "Event created successfully!",
            event: formattedEvent
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get all events (Everyone can see all active events)
const getAllEvents = async (req, res) => {
    try {
        const events = await Event.findAll({
            where: { isActive: true },
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'username', 'email']
                },
                {
                    model: Course,
                    as: 'course',
                    attributes: ['id', 'title', 'code'],
                    required: false
                }
            ],
            order: [['eventDate', 'ASC']]
        });

        // Format response with id included
        const formattedEvents = events.map(event => ({
            id: event.id, // Include the ID
            title: event.title,
            description: event.description,
            eventType: event.eventType,
            priority: event.priority,
            eventDate: event.eventDate,
            createdBy: event.createdBy, // Include createdBy for permission checks
            creator: event.creator,
            ...(event.course && { course: event.course })
        }));

        return res.status(200).json({
            success: true,
            message: "All events retrieved successfully",
            events: formattedEvents
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching events",
            error: error.message
        });
    }
};

// Get events by course (Everyone can see, filtered by course)
const getCourseEvents = async (req, res) => {
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

        const events = await Event.findAll({
            where: { 
                courseId: courseId,
                isActive: true 
            },
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['username']
                }
            ],
            order: [['eventDate', 'ASC']]
        });

        // Format response
        const formattedEvents = events.map(event => ({
            title: event.title,
            description: event.description,
            eventType: event.eventType,
            priority: event.priority,
            eventDate: event.eventDate,
            creator: event.creator.username,
            course: course.title
        }));
        
        return res.status(200).json({
            success: true,
            message: "Course events retrieved successfully",
            events: formattedEvents
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching course events",
            error: error.message
        });
    }
};

// Get events created by the logged-in faculty/admin
const getMyEvents = async (req, res) => {
    try {
        const createdBy = req.user.id;

        const events = await Event.findAll({
            where: { 
                createdBy: createdBy,
                isActive: true 
            },
            include: [
                {
                    model: Course,
                    as: 'course',
                    attributes: ['title'],
                    required: false
                }
            ],
            order: [['eventDate', 'ASC']]
        });

        // Format response
        const formattedEvents = events.map(event => ({
            title: event.title,
            description: event.description,
            eventType: event.eventType,
            priority: event.priority,
            eventDate: event.eventDate,
            creator: req.user.username,
            ...(event.course && { course: event.course.title })
        }));

        return res.status(200).json({
            success: true,
            message: "Your events retrieved successfully",
            events: formattedEvents
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching your events",
            error: error.message
        });
    }
};

// Get single event by ID (Everyone can see)
const getEventById = async (req, res) => {
    try {
        const eventId = req.params.id;

        const event = await Event.findOne({
            where: { 
                id: eventId,
                isActive: true 
            },
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['username']
                },
                {
                    model: Course,
                    as: 'course',
                    attributes: ['title'],
                    required: false
                }
            ]
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        // Format response
        const formattedEvent = {
            title: event.title,
            description: event.description,
            eventType: event.eventType,
            priority: event.priority,
            eventDate: event.eventDate,
            creator: event.creator.username,
            ...(event.course && { course: event.course.title })
        };

        return res.status(200).json({
            success: true,
            message: "Event retrieved successfully",
            event: formattedEvent
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching event",
            error: error.message
        });
    }
};

// Faculty/Admin can update their own events
const updateEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;
        const { title, description, eventType, eventDate, courseId, priority } = req.body;

        const event = await Event.findOne({
            where: { 
                id: eventId,
                isActive: true 
            }
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        // Only creator or admin can update
        if (userRole !== 'admin' && event.createdBy !== userId) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to update this event"
            });
        }

        // Validate event date if being updated
        if (eventDate) {
            const eventDateTime = new Date(eventDate);
            if (eventDateTime < new Date()) {
                return res.status(400).json({
                    success: false,
                    message: "Event date cannot be in the past!"
                });
            }
        }

        // If courseId is being updated, verify the course exists
        if (courseId && courseId !== event.courseId) {
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

        await event.update({
            title: title || event.title,
            description: description || event.description,
            eventType: eventType || event.eventType,
            eventDate: eventDate ? new Date(eventDate) : event.eventDate,
            courseId: courseId !== undefined ? courseId : event.courseId,
            priority: priority || event.priority
        });

        // Get updated event with details
        const updatedEvent = await Event.findByPk(eventId, {
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['username']
                },
                {
                    model: Course,
                    as: 'course',
                    attributes: ['title'],
                    required: false
                }
            ]
        });

        // Format response
        const formattedEvent = {
            title: updatedEvent.title,
            description: updatedEvent.description,
            eventType: updatedEvent.eventType,
            priority: updatedEvent.priority,
            eventDate: updatedEvent.eventDate,
            creator: updatedEvent.creator.username,
            ...(updatedEvent.course && { course: updatedEvent.course.title })
        };

        return res.status(200).json({
            success: true,
            message: "Event updated successfully",
            event: formattedEvent
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating event",
            error: error.message
        });
    }
};

// Faculty/Admin can delete their own events (soft delete)
const deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;

        const event = await Event.findOne({
            where: { 
                id: eventId,
                isActive: true 
            }
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        // Only creator or admin can delete
        if (userRole !== 'admin' && event.createdBy !== userId) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to delete this event"
            });
        }

        await event.update({ isActive: false });

        return res.status(200).json({
            success: true,
            message: "Event deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error deleting event",
            error: error.message
        });
    }
};

module.exports = {
    createEvent,
    getAllEvents,
    getCourseEvents,
    getMyEvents,
    getEventById,
    updateEvent,
    deleteEvent
};