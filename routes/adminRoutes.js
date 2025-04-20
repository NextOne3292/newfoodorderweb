import express from 'express';
import { adminSignUp, adminLogin, getUsers, updateUserRole ,adminLogout, deleteUser} from '../controllers/adminControllers.js';

import {adminAuth}from '../middlewares/adminAuth.js';

const router = express.Router();
// Admin sign-up route
router.post('/signup', adminSignUp);

// Admin login route
router.post('/login', adminLogin);

// Get all users (admin only)
router.get('/users', adminAuth, getUsers);

// Update user role (admin only)
router.put('/users/:id/role', adminAuth, updateUserRole);


//logout
router.get("/logout", adminAuth, adminLogout);// Delete user (admin only)
router.delete('/users/:id', adminAuth, deleteUser);


export { router as adminRouter };
