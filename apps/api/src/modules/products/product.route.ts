import { Router } from "express";
import productModel from "./product.model";

const productRouter = Router()

productRouter .get('/', async (_req, res) =>{
    try {
        const snackDrink = await productModel.find()
        res.json(snackDrink)
    } catch (error) {
        res.status(500).json({ error: "Không thấy sản phẩm"})
    }
});
productRouter .post('/', async(req, res) =>{
    try {
        const snackDrink = new productModel(req.body);
        await snackDrink.save()
        res.status(201).json(snackDrink)
    } catch (error) {
        res.status(400).json({ error: "Không thêm được sản phẩm"})
    }
});
productRouter .delete('/:id', async(req, res) =>{
    try {
        const snackDrink = await productModel.findByIdAndDelete(req.params.id);
        if(!snackDrink) return res.status(404).json({ error: "Không thấy product"})
        res.json({ message: "Xóa thành công"})
    } catch (error) {
        res.status(500).json({ error: "Xóa không thành công" });
    }
});

export default productRouter;