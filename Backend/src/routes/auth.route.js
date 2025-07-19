import express from 'express';
import { login, logout, signup, updateProfile, checkAuthorization } from '../controllers/auth.controller.js';
import { checkAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

router.put('/update-profile', checkAuth, updateProfile);

router.get('/check-auth', checkAuth, checkAuthorization )


export default router;