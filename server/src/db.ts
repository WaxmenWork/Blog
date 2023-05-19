import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

const DB_Host = process.env.DB_Host;
const DB_Name = process.env.DB_Name;
const DB_Username = process.env.DB_Username;
const DB_Password = process.env.DB_Password;

export const sequelize = new Sequelize(DB_Name!, DB_Username!, DB_Password!, {
    host: DB_Host,
    dialect: 'postgres'
});