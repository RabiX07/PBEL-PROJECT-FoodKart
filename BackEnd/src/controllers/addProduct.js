import Products from "../model/Products.js";
import uploadCloudinary from "../utils/cloudinary.js";

export const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        const result = await uploadCloudinary(req.files.image, "FoodKart", 800, 90);
        const imageUrl = result.secure_url; 
        if (!name || !description || !price || !category || !stock || !imageUrl) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newProduct = new Products({
            name,
            description,
            price,
            category,
            stock,
            imageUrl
        });
        await newProduct.save();
        res.status(201).json({ message: "Product added successfully", product: newProduct });
    }
    catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

export const getProducts = async (req, res) => {
    try {
        const products = await Products.find({});
        res.status(200).json({ message: "Products fetched successfully", products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const updates = req.body;
        const updatedProduct = await Products.findByIdAndUpdate(productId, updates, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

export const updateStock = async (req, res) => {
    try {
        const { productId } = req.params;
        const { stock } = req.body;
        const updatedProduct = await Products.findByIdAndUpdate(
            productId,
            { stock },
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product stock updated successfully", product: updatedProduct });
    }
    catch (error) {
        console.error("Error updating product stock:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const deleted = await Products.findByIdAndDelete(productId);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
