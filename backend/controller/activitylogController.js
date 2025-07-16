const { ActivityLog, User } = require("../model");

// Create activity log (Internal function - usually called by other controllers)
const createActivityLog = async (userId, action, entityType, entityId = null, description = null, req = null) => {
    try {
        const logData = {
            userId,
            action,
            entityType,
            entityId,
            description,
            ipAddress: req ? req.ip || req.connection.remoteAddress : null,
            userAgent: req ? req.get('User-Agent') : null
        };

        await ActivityLog.create(logData);
    } catch (error) {
        console.error('Error creating activity log:', error);
    }
};

// Admin can view all activity logs
const getAllActivityLogs = async (req, res) => {
    try {
        const logs = await ActivityLog.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['username', 'email', 'role']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        // Format response
        const formattedLogs = logs.map(log => ({
            action: log.action,
            entityType: log.entityType,
            entityId: log.entityId,
            description: log.description,
            timestamp: log.created_at,
            user: log.user.username,
            userRole: log.user.role,
            ipAddress: log.ipAddress
        }));

        return res.status(200).json({
            success: true,
            message: "All activity logs retrieved successfully",
            logs: formattedLogs
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching activity logs",
            error: error.message
        });
    }
};

// Admin can view activity logs by user
const getUserActivityLogs = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Check if user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }

        const logs = await ActivityLog.findAll({
            where: { userId: userId },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['username', 'email', 'role']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        // Format response
        const formattedLogs = logs.map(log => ({
            action: log.action,
            entityType: log.entityType,
            entityId: log.entityId,
            description: log.description,
            timestamp: log.created_at,
            ipAddress: log.ipAddress
        }));

        return res.status(200).json({
            success: true,
            message: "User activity logs retrieved successfully",
            user: {
                username: user.username,
                email: user.email,
                role: user.role
            },
            logs: formattedLogs
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching user activity logs",
            error: error.message
        });
    }
};

// Admin can view activity logs by entity type
const getActivityLogsByEntityType = async (req, res) => {
    try {
        const entityType = req.params.entityType;

        // Validate entity type
        const validEntityTypes = ['user', 'course', 'enrollment', 'notes', 'event', 'announcement'];
        if (!validEntityTypes.includes(entityType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid entity type!"
            });
        }

        const logs = await ActivityLog.findAll({
            where: { entityType: entityType },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['username', 'email', 'role']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        // Format response
        const formattedLogs = logs.map(log => ({
            action: log.action,
            entityId: log.entityId,
            description: log.description,
            timestamp: log.created_at,
            user: log.user.username,
            userRole: log.user.role,
            ipAddress: log.ipAddress
        }));

        return res.status(200).json({
            success: true,
            message: `Activity logs for ${entityType} retrieved successfully`,
            entityType: entityType,
            logs: formattedLogs
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching activity logs by entity type",
            error: error.message
        });
    }
};

// Users can view their own activity logs
const getMyActivityLogs = async (req, res) => {
    try {
        const userId = req.user.id;

        const logs = await ActivityLog.findAll({
            where: { userId: userId },
            order: [['created_at', 'DESC']]
        });

        // Format response
        const formattedLogs = logs.map(log => ({
            action: log.action,
            entityType: log.entityType,
            entityId: log.entityId,
            description: log.description,
            timestamp: log.created_at,
            ipAddress: log.ipAddress
        }));

        return res.status(200).json({
            success: true,
            message: "Your activity logs retrieved successfully",
            logs: formattedLogs
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching your activity logs",
            error: error.message
        });
    }
};

// Admin can get activity log statistics
const getActivityLogStats = async (req, res) => {
    try {
        const { Op } = require('sequelize');
        const { sequelize } = require('../db/database');

        // Get total logs count
        const totalLogs = await ActivityLog.count();

        // Get logs count by entity type
        const logsByEntityType = await ActivityLog.findAll({
            attributes: [
                'entityType',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['entityType']
        });

        // Get logs count by action
        const logsByAction = await ActivityLog.findAll({
            attributes: [
                'action',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['action']
        });

        // Get recent activity (last 24 hours)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const recentActivity = await ActivityLog.count({
            where: {
                created_at: {
                    [Op.gte]: yesterday
                }
            }
        });

        return res.status(200).json({
            success: true,
            message: "Activity log statistics retrieved successfully",
            stats: {
                totalLogs,
                recentActivity,
                logsByEntityType: logsByEntityType.map(item => ({
                    entityType: item.entityType,
                    count: parseInt(item.dataValues.count)
                })),
                logsByAction: logsByAction.map(item => ({
                    action: item.action,
                    count: parseInt(item.dataValues.count)
                }))
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching activity log statistics",
            error: error.message
        });
    }
};

// Admin can delete old activity logs (cleanup)
const deleteOldActivityLogs = async (req, res) => {
    try {
        const { days = 90 } = req.body; // Default to 90 days
        const { Op } = require('sequelize');

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const deletedCount = await ActivityLog.destroy({
            where: {
                created_at: {
                    [Op.lt]: cutoffDate
                }
            }
        });

        return res.status(200).json({
            success: true,
            message: `Successfully deleted ${deletedCount} old activity logs`,
            deletedCount: deletedCount,
            cutoffDate: cutoffDate
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error deleting old activity logs",
            error: error.message
        });
    }
};

module.exports = {
    createActivityLog,
    getAllActivityLogs,
    getUserActivityLogs,
    getActivityLogsByEntityType,
    getMyActivityLogs,
    getActivityLogStats,
    deleteOldActivityLogs
};