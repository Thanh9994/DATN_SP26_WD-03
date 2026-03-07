import { Request, Response } from "express";
import slugify from "../../../utils/slugify";
import { catchAsync } from "@api/utils/catchAsync";
import { Post } from "./post.model";

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private/Admin
export const createPost = catchAsync(async (req: Request, res: Response) => {
  const {
    title,
    content,
    summary,
    type,
    status,
    startDate,
    endDate,
    thumbnail,
  } = req.body;

  if (!title || !content) {
    res.status(400).json({ message: "Title and content are required" });
    return;
  }

  const slug = slugify(title);

  const newPost = await Post.create({
    title,
    slug,
    content,
    summary,
    type,
    status,
    startDate,
    endDate,
    thumbnail,
  });

  res.status(201).json({
    message: "Post created successfully",
    data: newPost,
  });
});

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
export const getPosts = catchAsync(async (req: Request, res: Response) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.status(200).json({
    message: "Posts fetched successfully",
    data: posts,
  });
});

// @desc    Get single post by slug
// @route   GET /api/posts/:slug
// @access  Public
export const getPostBySlug = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const post = await Post.findOne({ slug });

  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }

  res.status(200).json({
    message: "Post fetched successfully",
    data: post,
  });
});

// @desc    Update a post
// @route   PATCH /api/posts/:id
// @access  Private/Admin
export const updatePost = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    title,
    content,
    summary,
    type,
    status,
    startDate,
    endDate,
    thumbnail,
  } = req.body;

  const post = await Post.findById(id);

  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }

  const updatedData: any = {
    title,
    content,
    summary,
    type,
    status,
    startDate,
    endDate,
    thumbnail,
  };

  if (title) {
    updatedData.slug = slugify(title);
  }

  const updatedPost = await Post.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    message: "Post updated successfully",
    data: updatedPost,
  });
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private/Admin
export const deletePost = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const post = await Post.findById(id);

  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }

  await Post.findByIdAndDelete(id);

  res.status(200).json({ message: "Post deleted successfully" });
});
