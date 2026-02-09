import { Request, Response } from "express";
import cinemaModel from "./cinema.model";

export const AllCinemas = async (req: Request, res: Response) => {
    try {
        const cinemas = await cinemaModel.find();
        res.status(200).json({
            message: "Lấy danh sách rạp thành công",
            data: cinemas
        });
    } catch (error) {
        res.status(500).json({ message: error});
    }
};

export const createCinema = async (req: Request, res: Response) => {
    try {
        const newCinema = await cinemaModel.create(req.body);
        res.status(201).json({
            message: "Tạo rạp mới thành công",
            data: newCinema
        });
        res.json(createCinema)
    } catch (error) {
        res.status(400).json({ message: error});
    }
};
