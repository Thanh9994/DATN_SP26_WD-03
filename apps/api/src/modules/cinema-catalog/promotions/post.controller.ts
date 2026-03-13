import { Request, Response } from "express";
import slugify from "../../../utils/assets/slugify";
import { catchAsync } from "@api/utils/catchAsync";
import { Post } from "./post.model";

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private/Admin
export const createPost = catchAsync(async (req: Request, res: Response) => {
  const {
    avatar,
    title,
    content,
    summary,
    type,
    status,
    startDate,
    endDate,
    featured,
  } = req.body;

  if (!title || !content) {
    res.status(400).json({ message: "Title and content are required" });
    return;
  }

  const slug = slugify(title);

  const newPost = await Post.create({
    avatar,
    title,
    slug,
    content,
    summary,
    type,
    status,
    startDate,
    endDate,
    featured,
  });

  res.status(201).json({
    message: "Post created successfully",
    data: newPost,
  });
});

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
export const getPosts = catchAsync(async (_req: Request, res: Response) => {
  const posts = await Post.find().select("-__v").sort({ createdAt: -1 });
  res.status(200).json({
    message: "Posts fetched successfully",
    data: posts,
  });
});

export const getPostById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const post = await Post.findById(id);

  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }

  res.status(200).json({
    message: "Post fetched successfully",
    data: post,
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
    avatar,
    title,
    content,
    summary,
    type,
    status,
    startDate,
    endDate,
    featured,
  } = req.body;

  const post = await Post.findById(id);

  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }

  const updatedData: any = {
    avatar,
    title,
    content,
    summary,
    type,
    status,
    startDate,
    endDate,
    featured,
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
