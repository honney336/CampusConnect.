const express = require("express"); 
const { connectDB, sequelize } = require("./db/database");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));

app.get('/', (req, res) => {
    res.json({ 
        success: true, 
        message: "Welcome to CampusConnect" 
    });
});

// Routes
app.use('/api/auth', require("./route/authRoute")); 
app.use('/api/user', require("./route/loginRoute")); 
app.use('/api/user', require("./route/userRoute"));
app.use('/api/course', require("./route/courseRoute"));
app.use('/api/enrollment', require("./route/enrollmentRoute"));
app.use('/api/announcement', require("./route/announcementRoute"));
app.use('/api/event/', require("./route/eventRoute"));
app.use('/api/activity-log', require("./route/activitylogRoute"));
app.use('/api/notes', require("./route/notesRoute"));

module.exports = app;