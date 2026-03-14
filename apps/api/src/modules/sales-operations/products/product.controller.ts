import { Request, Response } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "./product.service";

export const getAll = async (_req: Request, res: Response) => {
  try {
    const products = await getAllProducts();
    return res.status(200).json(products);
  } catch (error) {
    console.error("getAll products error:", error);
    return res.status(500).json({ error: "Lỗi khi lấy danh sách sản phẩm" });
  }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error("getOne product error:", error);
    return res.status(500).json({ error: "Lỗi khi lấy chi tiết sản phẩm" });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const newProduct = await createProduct(req.body);
    return res.status(201).json(newProduct);
  } catch (error) {
    console.error("create product error:", error);
    return res.status(400).json({ error: "Không thêm được sản phẩm" });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const updatedProduct = await updateProduct(req.params.id, req.body);
    if (!updatedProduct) {
      return res
        .status(404)
        .json({ error: "Không tìm thấy sản phẩm để cập nhật" });
    }
    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("update product error:", error);
    return res.status(400).json({ error: "Cập nhật thất bại" });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const deletedProduct = await deleteProduct(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm để xóa" });
    }
    return res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    console.error("delete product error:", error);
    return res.status(500).json({ error: "Xóa không thành công" });
  }
};