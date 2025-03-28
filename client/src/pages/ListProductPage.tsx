import { useState } from "react";
import { API_URL } from "../App";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
    name: string;
    price: number;
    image: string;
    description: string;
}

const ListProductPage = () => {
    const [productDetails, setProductDetails] = useState<Product>({
        name: "",
        price: 0,
        image: "",
        description: "",
    });
    const [submittedProduct, setSubmittedProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProductDetails({
            ...productDetails,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        const payload = [{
            storeName: productDetails.name,
            price: productDetails.price,
            imgUrl: productDetails.image,
            description: productDetails.description,
        }];

        try {
            const response = await fetch(`${API_URL}api/community/product/list`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `BEARER ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmittedProduct(data.data);
                setProductDetails({
                    name: "",
                    price: 0,
                    image: "",
                    description: "",
                });
                setSuccessMessage("Product listed successfully!");
            } else {
                setErrorMessage(data.message || "Error creating product.");
            }
        } catch (error) {
            console.error("Error:", error);
            setErrorMessage("Failed to create product. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f1535] to-[#111c44] p-8 font-['Inter']">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold bg-gradient-to-r from-[#0075ff] to-[#00a3ff] bg-clip-text text-transparent"
                    >
                        List a New Product
                    </motion.h1>
                    <p className="text-gray-400 mt-2">Create and list your product in the marketplace</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#ffffff10] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-8"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-white font-medium mb-2">
                                Product Name
                            </label>
                            <motion.input
                                whileFocus={{ scale: 1.01 }}
                                type="text"
                                name="name"
                                value={productDetails.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#ffffff10] border border-[#ffffff20] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#0075ff] transition-all duration-300"
                                placeholder="Enter product name"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-white font-medium mb-2">
                                Price (in credits)
                            </label>
                            <motion.input
                                whileFocus={{ scale: 1.01 }}
                                type="number"
                                name="price"
                                value={productDetails.price}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#ffffff10] border border-[#ffffff20] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#0075ff] transition-all duration-300"
                                placeholder="Enter price"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-white font-medium mb-2">
                                Product Image URL
                            </label>
                            <motion.input
                                whileFocus={{ scale: 1.01 }}
                                type="text"
                                name="image"
                                value={productDetails.image}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#ffffff10] border border-[#ffffff20] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#0075ff] transition-all duration-300"
                                placeholder="Enter image URL"
                            />
                        </div>

                        <div>
                            <label className="block text-white font-medium mb-2">
                                Description
                            </label>
                            <motion.textarea
                                whileFocus={{ scale: 1.01 }}
                                name="description"
                                value={productDetails.description}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#ffffff10] border border-[#ffffff20] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#0075ff] transition-all duration-300 min-h-[120px]"
                                placeholder="Enter product description"
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-6 py-3 bg-gradient-to-r from-[#0075ff] to-[#00a3ff] rounded-xl text-white font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                </div>
                            ) : (
                                "List Product"
                            )}
                        </motion.button>
                    </form>

                    <AnimatePresence>
                        {successMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mt-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 text-center"
                            >
                                {successMessage}
                            </motion.div>
                        )}

                        {errorMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-center"
                            >
                                {errorMessage}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {submittedProduct && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-8 bg-[#ffffff10] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-6"
                            >
                                <h3 className="text-xl font-bold text-white mb-4">Product Preview</h3>
                                <div className="flex flex-col md:flex-row gap-6">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="w-full md:w-1/3 aspect-square rounded-xl overflow-hidden border border-[#ffffff20]"
                                    >
                                        <img
                                            src={submittedProduct.image}
                                            alt={submittedProduct.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </motion.div>
                                    <div className="flex-1 space-y-4">
                                        <h4 className="text-xl font-bold bg-gradient-to-r from-[#0075ff] to-[#00a3ff] bg-clip-text text-transparent">
                                            {submittedProduct.name}
                                        </h4>
                                        <p className="text-white font-medium">
                                            {submittedProduct.price} credits
                                        </p>
                                        <p className="text-gray-400">
                                            {submittedProduct.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ListProductPage;
