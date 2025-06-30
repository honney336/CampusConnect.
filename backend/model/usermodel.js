const {DataTypes} = require("sequelize");
const {sequelize} = require("../db/database");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          notEmpty: true,
        },
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [8, 255],
          notEmpty: true,
        },
      },

      role: {
        type: DataTypes.ENUM("student", "faculty", "admin"),
        allowNull: false,
        defaultValue: "student",
      }
    },

    {
      tableName: "users",
      timestamps: true,
      // createdAt: "created_at",
      // updatedAt: "updated_at",
    }
  );

  User.associate = (models) => {
    // User has many courses as faculty
    User.hasMany(models.Course, {
      foreignKey: "facultyId",
      as: "courses",
    });

    // User has many enrollments as student
    User.hasMany(models.Enrollment, {
      foreignKey: "studentId",
      as: "enrollments",
    });

    // User has many announcements created
    User.hasMany(models.Announcement, {
      foreignKey: "createdBy",
      as: "announcements",
    });

    // User has many events created
    User.hasMany(models.Event, {
      foreignKey: "createdBy",
      as: "events",
    });

    // User has many notes uploaded
    User.hasMany(models.Notes, {
      foreignKey: "uploadedBy",
      as: "notes",
    });

    // User has many activity logs
    User.hasMany(models.ActivityLog, {
      foreignKey: "userId",
      as: "activityLogs",
    });
  };

  return User;
};