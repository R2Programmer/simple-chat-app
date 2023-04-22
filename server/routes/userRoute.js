import express from 'express';
import {getUser, followUser, unfollowUser} from '../controllers/userController.js'
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router()

router.get('/:id', getUser);
router.put('/:id/follow',authMiddleware, followUser)
router.put('/:id/unfollow',authMiddleware, unfollowUser)

export default router;