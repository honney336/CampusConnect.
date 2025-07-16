  // Announcement Model
  const { DataTypes } = require("sequelize");

  module.exports = (sequelize) => {
    const Announcement = sequelize.define(
      "Announcement",
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        announcementType: {
          type: DataTypes.ENUM(
            "general",
            "academic",
            "exam",
            "assignment",
            "event",
            "urgent"
          ),
          defaultValue: "general",
          field: "announcement_type",
        },
        createdBy: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "created_by",
        },
        courseId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: "course_id",
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
          field: "is_active",
        },
      },
      {
        tableName: "announcements",
        timestamps: true,
        createdAt: "created_At",
        updatedAt: "updated_At",
      }
    );

    Announcement.associate = (models) => {
      // Announcement belongs to Creator (User)
      Announcement.belongsTo(models.User, {
        foreignKey: "createdBy",
        as: "creator",
      });

      // Announcement belongs to Course (optional)
      Announcement.belongsTo(models.Course, {
        foreignKey: "courseId",
        as: "course",
      });
    };

    return Announcement;
  };