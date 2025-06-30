const { sequelize } = require("../db/database");

// Import all models
const User = require("./usermodel")(sequelize);
const Course = require("./coursemodel")(sequelize);
const Enrollment = require("./enrollmentmodel")(sequelize);
const Announcement = require("./announcementmodel")(sequelize);
const Event = require("./eventmodel")(sequelize);
const Notes = require("./notesmodel")(sequelize);
const ActivityLog = require("./activitylogmodel")(sequelize);

// Create models object
const models = {
  User,
  Course,
  Enrollment,
  Announcement,
  Event,
  Notes,
  ActivityLog,
};

// Set up associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  sequelize,
  ...models,
};