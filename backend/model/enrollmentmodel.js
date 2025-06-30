// Simplified version without status
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Enrollment = sequelize.define(
    "Enrollment",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "student_id",
      },
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "course_id",
      },
      enrolledAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: "enrolled_at",
      },
    },
    {
      tableName: "enrollments",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          unique: true,
          fields: ["student_id", "course_id"],
        },
      ],
    }
  );

  Enrollment.associate = (models) => {
    Enrollment.belongsTo(models.User, {
      foreignKey: "studentId",
      as: "student",
    });

    Enrollment.belongsTo(models.Course, {
      foreignKey: "courseId",
      as: "course",
    });
  };

  return Enrollment;
};