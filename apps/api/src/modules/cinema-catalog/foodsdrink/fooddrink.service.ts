import { FoodDrink } from "./fooddrink.model";

export const getAllFoodDrinks = async () => {
  return await FoodDrink.find({ kha_dung: true }).sort({ createdAt: -1 });
};

export const getFoodDrinkById = async (id: string) => {
  return await FoodDrink.findById(id);
};

export const createFoodDrink = async (data: any) => {
  return await FoodDrink.create(data);
};

export const updateFoodDrink = async (id: string, data: any) => {
  return await FoodDrink.findByIdAndUpdate(id, data, { new: true });
};

export const deleteFoodDrink = async (id: string) => {
  return await FoodDrink.findByIdAndDelete(id);
};