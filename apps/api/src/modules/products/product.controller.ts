import { Request, Response } from "express";
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "./product.service";

export const getAll = async (req: Request, res: Response) => {
    try {
        const products = await getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi lấy danh sách sản phẩm" });
    }
};

export const getOne = async (req: Request, res: Response) => {
    try {
        const product = await getProductById(req.params.id);
        if (!product) return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi lấy chi tiết sản phẩm" });
    }
};

export const create = async (req: Request, res: Response) => {
    try {
        const newProduct = await createProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: "Không thêm được sản phẩm" });
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const updatedProduct = await updateProduct(req.params.id, req.body);
        if (!updatedProduct) return res.status(404).json({ error: "Không tìm thấy sản phẩm để cập nhật" });
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: "Cập nhật thất bại" });
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const deletedProduct = await deleteProduct(req.params.id);
        if (!deletedProduct) return res.status(404).json({ error: "Không tìm thấy sản phẩm để xóa" });
        res.status(200).json({ message: "Xóa thành công" });
    } catch (error) {
        res.status(500).json({ error: "Xóa không thành công" });
    }
};
