import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance.js";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Link } from "react-router";

export default function AdminMenu() {
    const PRIMARY_YELLOW = "#f6b318";

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    const [newName, setNewName] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [newPrice, setNewPrice] = useState("");
    const [newStock, setNewStock] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [newImage, setNewImage] = useState(null);

    // Fetch all products
    const fetchProducts = async () => {
        try {
            const res = await axiosInstance.get("/products/all");
            setProducts(res.data.products || []);
        } catch (err) {
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Update stock
    const updateStock = async (id, value) => {
        try {
            const res = await axiosInstance.patch(`/products/update-stock/${id}`, {
                stock: Number(value),
            });

            if (res.data.message === "Product stock updated successfully") {
                toast.success("Stock updated!");
                fetchProducts();
            }
        } catch (err) {
            toast.error("Stock update failed");
        }
    };

    // Delete product
    const deleteProduct = async (id) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const res = await axiosInstance.delete(`/products/delete/${id}`);

            if (res.data.success) {
                toast.success("Product removed");
                fetchProducts();
            }
        } catch (error) {
            toast.error("Failed to delete product");
        }
    };

    // Add new product
    const addProduct = async () => {
        if (!newName || !newPrice || !newStock || !newImage) {
            toast.error("Please fill all required fields");
            return;
        }

        setAdding(true);

        const formData = new FormData();
        formData.append("name", newName);
        formData.append("description", newDesc);
        formData.append("price", newPrice);
        formData.append("stock", newStock);
        formData.append("category", newCategory);
        formData.append("image", newImage);

        try {
            const res = await axiosInstance.post("/products/add", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data.message === "Product added successfully") {
                toast.success("Product added!");
                fetchProducts();

                setNewName("");
                setNewDesc("");
                setNewPrice("");
                setNewStock("");
                setNewCategory("");
                setNewImage(null);
            }
        } catch (err) {
            toast.error("Failed to add product");
        } finally {
            setAdding(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-10">
            <h1 className="text-3xl font-bold mb-6">Manage Menu</h1>

            {/* Add Product */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl mb-10"
            >

                <Link
                    to="/admin/dashboard"
                    className="absolute top-4 right-4 text-white/70 hover:text-white text-sm underline"
                >
                    ← Back to Dashboard
                </Link>


                <h2 className="text-xl font-semibold mb-4">Add New Product</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input className="p-3 rounded bg-gray-800 border border-white/10"
                        placeholder="Product Name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />

                    <input className="p-3 rounded bg-gray-800 border border-white/10"
                        placeholder="Price"
                        type="number"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                    />

                    <input className="p-3 rounded bg-gray-800 border border-white/10"
                        placeholder="Stock"
                        type="number"
                        value={newStock}
                        onChange={(e) => setNewStock(e.target.value)}
                    />

                    <input className="p-3 rounded bg-gray-800 border border-white/10"
                        placeholder="Category"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                    />

                    <textarea className="p-3 rounded bg-gray-800 border border-white/10 md:col-span-2"
                        placeholder="Description"
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                    />


                    <div className="md:col-span-2">
                        <input
                            type="file"
                            id="imageInput"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => setNewImage(e.target.files[0])}
                        />

                        <button
                            onClick={() => document.getElementById("imageInput").click()}
                            className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/10 shadow transition text-left"
                        >
                            {newImage ? (
                                <span className="font-medium">
                                    📁 {newImage.name}
                                </span>
                            ) : (
                                <span className="text-white/70">📤 Upload Product Image</span>
                            )}
                        </button>
                    </div>




                </div>

                <button
                    onClick={addProduct}
                    disabled={adding}
                    className={`mt-4 w-full py-3 rounded-lg font-bold shadow ${adding ? "opacity-50" : "hover:opacity-90"}`}
                    style={{ backgroundColor: PRIMARY_YELLOW, color: "#111" }}
                >
                    {adding ? "Adding..." : "Add Product"}
                </button>
            </motion.div>

            {/* Product List */}
            <h2 className="text-2xl font-semibold mb-4">Existing Menu Items</h2>

            {loading ? (
                <p className="text-white/70">Loading...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {products.map((p) => (
                        <motion.div key={p._id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/10 backdrop-blur-xl p-4 rounded-xl shadow"
                        >
                            <img src={p.imageUrl} className="w-full h-32 object-cover rounded mb-3" />

                            <h3 className="font-semibold text-lg">{p.name}</h3>
                            <p className="text-white/60">{p.category}</p>
                            <p className="font-bold">₹{p.price}</p>

                            <div className="mt-3 flex items-center justify-between">
                                <input
                                    type="number"
                                    value={p.stock}
                                    onChange={(e) => updateStock(p._id, e.target.value)}
                                    className="w-20 p-2 bg-gray-800 border border-white/10 rounded"
                                />

                                {/* ⭐ Remove Button */}
                                <button
                                    onClick={() => deleteProduct(p._id)}
                                    className="px-3 py-1 rounded bg-red-500 hover:bg-red-600"
                                >
                                    Remove
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
