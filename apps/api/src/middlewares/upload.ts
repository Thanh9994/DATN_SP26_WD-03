import { Router, Request, Response } from "express";
import cloudinary, { upload } from '../config/cloudinary';
const uploadRouter = Router();

uploadRouter.post('/', upload.single('image'), (req: Request , res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Không có file nào được tải lên' });
    }
    
    res.status(200).json({ 
      url: req.file.path, 
      public_id: req.file.filename,
    });
  } catch (error) {
    res.status(500).json({ message: "Không upload được ảnh", error });
  }
});

uploadRouter.get('/', async (_req, res) => {
  try {
    const result = await cloudinary.search
      .expression("folder:cinema_app/*") // đổi folder nếu cần
      .sort_by("created_at", "desc")
      .max_results(20)
      .execute();

    res.json(result.resources);
  } catch (error) {
    res.status(500).json({ message: "Không lấy được ảnh", error });
  }
});

uploadRouter.delete('/:public_id', async (req, res) => {
  try {
    const { public_id } = req.params;
    if(!public_id){
      return res.status(400).json({message: 'Không tìm thấy ID ảnh'})
    }
    await cloudinary.uploader.destroy(public_id)
    res.status(200).json({message: "Xóa Thành công", public_id})
  } catch (error) {
    res.status(500).json({ message: "Không xóa được ảnh", error });
  }
})
export default uploadRouter;