// Event Model
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Event = sequelize.define(
    "Event",
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
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      eventType: {
        type: DataTypes.ENUM(
          "exam",
          "assignment",
          "seminar",
          "workshop",
          "deadline",
          "holiday",
          "meeting",
          "other"
        ),
        allowNull: false,
        field: "event_type",
      },
      eventDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "event_date",
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
      priority: {
        type: DataTypes.ENUM("low", "medium", "high", "urgent"),
        defaultValue: "medium",
      },
    },
    {
      tableName: "events",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Event.associate = (models) => {
    // Event belongs to Creator (User)
    Event.belongsTo(models.User, {
      foreignKey: "createdBy",
      as: "creator",
    });

    // Event belongs to Course (optional)
    Event.belongsTo(models.Course, {
      foreignKey: "courseId",
      as: "course",
    });
  };

  return Event;
};