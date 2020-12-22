import express from "express";
const router = express.Router();

// from controller method
import {
  getPosts,
  createPost,
  deletePost,
  updatePost,
  likePost,
  createUser,
  getUser,
} from "../controllers/posts.js";

router.get("/", getPosts);
router.post("/", createPost);
router.delete("/:id", deletePost);
router.patch("/:id", updatePost);
router.patch("/like/:id", likePost);

router.post("/user", createUser);
router.get("/user", getUser);

export default router;
