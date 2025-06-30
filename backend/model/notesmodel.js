// Notes Model
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Notes = sequelize.define(
    "Notes",
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
      fileName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "file_name",
      },
      filePath: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "file_path",
      },
      fileType: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "file_type",
      },
      fileSize: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "file_size",
      },
      uploadedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "uploaded_by",
      },
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "course_id",
      },
      downloadCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: "download_count",
      },
      tags: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "notes",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Notes.associate = (models) => {
    // Notes belongs to Uploader (User)
    Notes.belongsTo(models.User, {
      foreignKey: "uploadedBy",
      as: "uploader",
    });

    // Notes belongs to Course
    Notes.belongsTo(models.Course, {
      foreignKey: "courseId",
      as: "course",
    });
  };

  return Notes;
};