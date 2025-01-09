import express from "express";
import userRoute from "./v1/user.route";
import followRoute from "./v1/follow.route";
import authRoute from "./v1/auth.route";
import threadRoute from "./v1/thread.route";
import replyRoute from "./v1/reply.route";
import likeRoute from "./v1/like.route";
import { authentication } from "../middlewares/authentication";
import { getAllUsers, getUserById } from "../controllers/user.controller";
import { createLike, deleteLike } from "../controllers/like.controller";
import { getAllThreads } from "../controllers/thread.controller";
import { searchUser } from "../controllers/search.controller";
import { validateToken } from "../controllers/token.validation";
const router = express.Router();

router.use('/auth', authRoute);
router.use('/user/:id', getUserById);
router.use('/users', authentication, userRoute);
router.use('/relation', authentication, followRoute); // /api/relation
router.use('/thread', authentication, threadRoute);
router.use('/reply', authentication, replyRoute);
router.use('/like', authentication, createLike);
router.use('/unlike', authentication, deleteLike);

router.get('/threads', getAllThreads);
router.get('/search', authentication, searchUser);
router.post('/validate-token', validateToken);

export default router;