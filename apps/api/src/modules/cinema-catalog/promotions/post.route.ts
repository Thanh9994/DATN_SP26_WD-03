import express from "express";
import {
  createPost,
  getPosts,
  getPostBySlug,
  updatePost,
  deletePost,
} from "./post.controller";

const router = express.Router();

router.route("/").post(createPost).get(getPosts);

router.route("/slug/:slug").get(getPostBySlug);

router
  .route("/:id")
  .patch(updatePost)
  .delete(deletePost);

export default router;
