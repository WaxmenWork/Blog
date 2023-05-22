import { NextFunction, Response, Router } from "express";
import userController from "../controllers/user-controller";
import {body, param, query} from 'express-validator';
import authMiddleware from "../middlewares/auth-middleware";
import blogController from "../controllers/blog-controller";
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const router = Router();

//post endpoints
router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 6, max: 32}),
    userController.registration
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/blog',
    authMiddleware,
    upload.array('media'),
    body('title').isLength({min: 6, max: 64}),
    blogController.createNewPost
);
router.post('/blog/:PostId/media',
    authMiddleware,
    upload.array('media'),
    blogController.addMediaToPost
);

//put endpoints
router.put('/blog/:id',
    authMiddleware,
    param('id')
        .isInt({min: 1}),
    blogController.updatePost
);

//delete endpoints
router.delete('/blog/:id',
    authMiddleware,
    param('id')
        .isInt({min: 1}),
    blogController.deletePost
);
router.delete('/media/:id',
    authMiddleware,
    param('id')
        .isInt({min: 1}),
    blogController.deleteMedia
);

//get endpoints
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);
router.get('/users/:id',
    authMiddleware,
    param('id')
        .isInt({min: 1}),
    userController.getUserById
);
router.get('/blog',
    authMiddleware,
    query('page')
        .optional()
        .isInt({ min: 1 }),
    query('limit')
        .optional()
        .isInt({ min: 1 }),
    blogController.getPosts
);
router.get('/blog/:id',
    authMiddleware,
    param('id')
        .isInt({min: 1}),
    blogController.getPostById
);

export default router;