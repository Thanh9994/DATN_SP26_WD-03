import { ISnackDrink } from "@shared/schemas";
import productModel from "./product.model";

export const getAllProducts = async () => {
    return await productModel.find();
};

export const getProductById = async (id: string) => {
    return await productModel.findById(id);
};

export const createProduct = async (data: ISnackDrink) => {
    return await productModel.create(data);
};

export const updateProduct = async (id: string, data: ISnackDrink) => {
    return await productModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteProduct = async (id: string) => {
    return await productModel.findByIdAndDelete(id);
};
