const {Sequelize} = require("sequelize")
require("dotenv").config();

const isTestEnvironment = process.env.NODE_ENV === 'test'
console.log(`Running in ${isTestEnvironment ? 'TEST' : 'DEVELOPMENT'}mode.`);

const sequelize = new Sequelize(
    isTestEnvironment ? process.env.TEST_DB_NAME: process.env.DB_NAME,
    process.env.DB_USER, process.env.DB_PASS, {
        host: process.env.DB_HOST, 
        dialect: "mysql",
        logging: false,
    });

const connectDB = async () => { 
    try { 
        await sequelize.authenticate();
        console.log("Database connected successfully");
    }

    catch (error){
        console.log("Unable to connect to the database", error);

    }
};

module.exports = {sequelize, connectDB};

 