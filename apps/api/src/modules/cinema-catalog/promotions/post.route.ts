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

postRouter.route("/").post(createPost).get(getPosts);

postRouter.route("/:slug").get(getPostBySlug);

postRouter.get("/id/:id", getPostById);

postRouter.route("/:id").patch(updatePost).delete(deletePost);

export default postRouter;
