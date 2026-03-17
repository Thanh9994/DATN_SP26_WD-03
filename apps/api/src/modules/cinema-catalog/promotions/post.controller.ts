import { Request, Response } from "express";
import slugify from "../../../utils/assets/slugify";
import { catchAsync } from "@api/utils/catchAsync";
import { Post } from "./post.model";

const notFound = (res: Response) =>
  res.status(404).json({ message: "Post not found" });

export const createPost = catchAsync(async (req: Request, res: Response) => {
  const { title, content, category, type, ...rest } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  const finalCategory = category || type || "promotion";
  const finalSlug = slugify(title);

  const existedPost = await Post.findOne({ slug: finalSlug });
  if (existedPost) {
    return res.status(400).json({ message: "Slug already exists" });
  }

  const newPost = await Post.create({
    ...rest,
    title,
    content,
    category: finalCategory,
    type: type || "promotion",
    slug: finalSlug,
  });

  res.status(201).json({
    message: "Post created successfully",
    data: newPost,
  });
});

export const getPosts = catchAsync(async (_req: Request, res: Response) => {
  const posts = await Post.find().select("-__v").sort({ createdAt: -1 });

  res.status(200).json({
    message: "Posts fetched successfully",
    data: posts,
  });
});

export const getPostById = catchAsync(async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.id);

  if (!post) return notFound(res);

  res.status(200).json({
    message: "Post fetched successfully",
    data: post,
  });
});

export const getPostBySlug = catchAsync(async (req: Request, res: Response) => {
  const post = await Post.findOne({ slug: req.params.slug });

  if (!post) return notFound(res);

  res.status(200).json({
    message: "Post fetched successfully",
    data: post,
  });
});

export const updatePost = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content, category, type, ...rest } = req.body;

  const updatedData: Record<string, any> = { ...rest };

  if (title) {
    updatedData.title = title;
    updatedData.slug = slugify(title);
  }

  if (content) updatedData.content = content;
  if (category) updatedData.category = category;
  if (type) updatedData.type = type;

  if (!updatedData.category && type) {
    updatedData.category = type;
  }

  const updatedPost = await Post.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });

  if (!updatedPost) return notFound(res);

  res.status(200).json({
    message: "Post updated successfully",
    data: updatedPost,
  });
});

export const deletePost = catchAsync(async (req: Request, res: Response) => {
  const post = await Post.findByIdAndDelete(req.params.id);

  if (!post) return notFound(res);

  res.status(200).json({
    message: "Post deleted successfully",
  });
});