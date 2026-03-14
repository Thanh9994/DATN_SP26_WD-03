import productModel from "./product.model";

export interface IProductPayload {
  name: string;
  image: string;
  originalPrice: number;
  price: number;
  isActive: boolean;
  isCombo: boolean;
  description?: string;
}

export const getAllProducts = async () => {
  return await productModel.find().sort({ createdAt: -1 });
};

export const getProductById = async (id: string) => {
  return await productModel.findById(id);
};

export const createProduct = async (data: IProductPayload) => {
  return await productModel.create(data);
};

export const updateProduct = async (id: string, data: Partial<IProductPayload>) => {
  return await productModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteProduct = async (id: string) => {
  return await productModel.findByIdAndDelete(id);
};