import { Router } from "express";
import { create, getAll, getOne, remove, update } from "./product.controller";

const productRouter = Router();

productRouter.get("/", getAll);
productRouter.get("/:id", getOne);
productRouter.post("/", create);
productRouter.put("/:id", update); // Thêm route update
productRouter.delete("/:id", remove);

export default productRouter;
