import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { sequelize } from './db';
import cors from 'cors';
import { associateModels, syncDatabase } from './models';
import router from './router';
import errorMiddleware from './middlewares/error-middleware';
import authMiddleware from './middlewares/auth-middleware';
import { serveMedia } from './controllers/blog-controller';

const PORT = process.env.PORT || 5000 ;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use("/media/:type/:ext/:file", serveMedia);
app.use('/api', router);
app.use(errorMiddleware);

const start = async () => {
    try {
        associateModels();
        await sequelize.sync();

        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        })
        } catch (e) {
            console.log(e);
        }
}

start();