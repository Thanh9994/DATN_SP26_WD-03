import { Request, Response } from "express";
import * as service from "./fooddrink.service";

export const getAll = async (req: Request, res: Response) => {
  const data = await service.getAllFoodDrinks();
  res.json(data);
};

export const getOne = async (req: Request, res: Response) => {
  const data = await service.getFoodDrinkById(req.params.id);
  res.json(data);
};

export const create = async (req: Request, res: Response) => {
  const data = await service.createFoodDrink(req.body);
  res.status(201).json(data);
};

export const update = async (req: Request, res: Response) => {
  const data = await service.updateFoodDrink(req.params.id, req.body);
  res.json(data);
};

export const remove = async (req: Request, res: Response) => {
  await service.deleteFoodDrink(req.params.id);
  res.json({ message: "Deleted successfully" });
};