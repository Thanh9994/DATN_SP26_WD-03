import express from "express";
import {
  createPost,
  getPosts,
  getPostBySlug,
  updatePost,
  deletePost,
  getPostById,
} from "./post.controller";

const postRouter = express.Router();

postRouter.post("/", createPost);
postRouter.get("/", getPosts);
postRouter.get("/slug/:slug", getPostBySlug);
postRouter.get("/id/:id", getPostById);
postRouter.patch("/:id", updatePost);
postRouter.delete("/:id", deletePost);

export default postRouter;