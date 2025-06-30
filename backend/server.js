const express = require("express"); 
const { connectDB, sequelize } = require("./db/database");
const cors= require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));

const PORT = process.env.PORT; 

app.get('/', (req, res) => {
res.send("Welcome to CampusConnect");
});

app.use('/api/auth', require("./route/authRoute")); 
app.use('/api/user', require("./route/loginRoute")); 
app.use('/api/user', require("./route/userRoute"));
app.use('/api/course', require("./route/courseRoute"));
app.use('/api/enrollment', require("./route/enrollemtRoute"));


const startServer = async () => {
    await connectDB();
    await sequelize.sync()
    app.listen(PORT, () =>{
        console.log(`Server is running on port ${PORT}`);
    });
    
};

startServer();


