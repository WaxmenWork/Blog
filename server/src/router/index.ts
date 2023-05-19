import { NextFunction, Response, Router } from "express";
import userController from "../controllers/user-controller";
import {body} from 'express-validator';
import authMiddleware from "../middlewares/auth-middleware";

const router = Router();

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 6, max: 32}),
    userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/blog');
router.put('/blog/:id');
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);
router.get('/users/:id');
router.get('/blog');

export default router;