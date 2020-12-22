import express from "express";
const router = express.Router();
import { auth } from "../verifyToken.js";

// from controller method
import {
  getPosts,
  createPost,
  deletePost,
  updatePost,
  likePost,
  createUser,
  loginUser,
  getPost,
  commentPost,
} from "../controllers/posts.js";

router.get("/user/post", auth, getPosts);
router.get("/user/post/:id", auth, getPost);
router.post("/user/post", auth, createPost);
router.delete("/user/post/:id", auth, deletePost);
router.patch("/user/post/:id", auth, updatePost);
router.patch("/user/post/like/:id", auth, likePost);
router.patch("/user/post/comment/:id", auth, commentPost);

// registratio process
router.post("/register", createUser);
router.post("/login", loginUser);

export default router;
