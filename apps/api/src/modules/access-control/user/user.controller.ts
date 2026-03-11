import { Request, Response } from "express";
import { User } from "./user.model";
import { UpdateUser } from '@shared/schemas';

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select("ho_ten email role trang_thai phone").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Không thể lấy danh sách người dùng", error });
  }
};

export const me = async (req: Request, res: Response) => {
  if (!req.user) return res.status(404).json({ message: "Không tìm thấy user" });
  const { ho_ten, email, role, phone, _id } = req.user;
  res.json({ _id, ho_ten, email, role, phone });
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const validation = UpdateUser.safeParse(req.body)

        if (!validation.success) {
            return res.status(400).json({ 
                message: "Dữ liệu không hợp lệ", 
                errors: validation.error  
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: validation.data },
            { new: true }
        ).select("-password");

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: "Lỗi server" })
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "Xóa Thành Công"});
    } catch (error) {
        res.status(400).json({ message: "Lỗi server" })
    }
}