import { Router } from "express";
import { addProduct , getProducts, updateProduct, updateStock, deleteProduct } from "../controllers/addProduct.js";
const route = Router();

route.post("/add", addProduct);
route.get("/all", getProducts);
route.put("/update/:productId", updateProduct);
route.patch("/update-stock/:productId", updateStock);
route.delete("/delete/:productId", deleteProduct);


export default route;