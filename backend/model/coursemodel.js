const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Course = sequelize.define(
    "Course",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },

      credit: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      semester: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 8,
        },
      },

      facultyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "faculty_id", // This maps to your database column
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: "is_active", // Added field mapping
      },
    },
    {
      tableName: "courses",
      timestamps: true,
      createdAt: "created_at", // Added timestamp mapping
      updatedAt: "updated_at",
    }
  );

  Course.associate = (models) => {
    // Course belongs to Faculty (User)
    Course.belongsTo(models.User, {
      foreignKey: "facultyId",
      as: "faculty",
    });

    // Course has many enrollments
    Course.hasMany(models.Enrollment, {
      foreignKey: "courseId",
      as: "enrollments",
    });

    // Course has many announcements
    Course.hasMany(models.Announcement, {
      foreignKey: "courseId",
      as: "announcements",
    });

    // Course has many events
    Course.hasMany(models.Event, {
      foreignKey: "courseId",
      as: "events",
    });

    // Course has many notes
    Course.hasMany(models.Notes, {
      foreignKey: "courseId",
      as: "notes",
    });
  };

  return Course;
};