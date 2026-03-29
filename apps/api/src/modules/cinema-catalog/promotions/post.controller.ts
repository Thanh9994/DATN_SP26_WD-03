import { Request, Response } from 'express';
import slugify from '../../../utils/assets/slugify';
import { catchAsync } from '@api/utils/catchAsync';
import { Post } from './post.model';

const notFound = (res: Response) => res.status(404).json({ message: 'Post not found' });

export const createPost = catchAsync(async (req: Request, res: Response) => {
  const { title, content, category, ...rest } = req.body;

  // 2. Validate nhanh
  if (!title || !content) {
    return res.status(400).json({ message: 'Tiêu đề và nội dung là bắt buộc' });
  }

  const slug = slugify(title);

  const isExisted = await Post.exists({ slug });
  if (isExisted) {
    return res.status(400).json({ message: 'Tiêu đề này đã được sử dụng' });
  }

  const categories = Array.isArray(category) ? category : [category || 'promotion'];

  const newPost = await Post.create({
    ...rest,
    title,
    content,
    slug,
    category: categories,
  });

  res.status(201).json({ data: newPost });
});

export const getPosts = catchAsync(async (req: Request, res: Response) => {
  const { cat } = req.query;
  const filter: any = {};

  if (cat) {
    filter.category = cat;
  }

  const posts = await Post.find(filter).select('-__v').sort({ createdAt: -1 });

  res.status(200).json({
    message: 'Posts fetched successfully',
    count: posts.length,
    data: posts,
  });
});

export const getPostById = catchAsync(async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.id);

  if (!post) return notFound(res);

  res.status(200).json({
    message: 'Post fetched successfully',
    data: post,
  });
});

export const getPostBySlug = catchAsync(async (req: Request, res: Response) => {
  const post = await Post.findOne({ slug: req.params.slug });

  if (!post) return notFound(res);

  res.status(200).json({
    message: 'Post fetched successfully',
    data: post,
  });
});

export const updatePost = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, category, ...rest } = req.body;
  const updatedData: any = { ...rest };
  if (title) {
    rest.title = title;
    rest.slug = slugify(title);
  }

  if (category) {
    rest.category = Array.isArray(category) ? category : [category];
  }
  delete updatedData.type;
  const updatedPost = await Post.findByIdAndUpdate(id, rest, {
    new: true,
    runValidators: true,
  });

  if (!updatedPost) return res.status(404).json({ message: 'Không tìm thấy bài viết' });

  res.status(200).json({ data: updatedPost });
});

export const deletePost = catchAsync(async (req: Request, res: Response) => {
  const post = await Post.findByIdAndDelete(req.params.id);

  if (!post) return notFound(res);

  res.status(200).json({
    message: 'Post deleted successfully',
  });
});
