import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "../App";
import ProductShowcase from "../components/ProductShowcase";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const MarketplacePage = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/api/community/product/list`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            authorization: `BEARER ${localStorage.getItem("token")}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }

                const data = await response.json();
                setProducts(data.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setErrorMessage("Failed to load products.");
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleProductClick = (product: any) => {
        setSelectedProduct(product);
    };

    return (
        <div className="min-h-screen bg-[#111111] p-4 sm:p-6 md:p-8 font-['Inter'] relative overflow-hidden">
            {/* Enhanced animated background elements */}
            <motion.div
                initial={{ opacity: 0, scale: 1.2 }}
                animate={{ opacity: 0.15, scale: 1 }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
                className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-purple-600/20 to-transparent"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.1, scale: 1.2 }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "mirror", delay: 0.5 }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/20 via-purple-400/10 to-transparent"
            />
            <motion.div
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: 0.05, scale: 1.1 }}
                transition={{ duration: 5, repeat: Infinity, repeatType: "mirror", delay: 1 }}
                className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(168,85,247,0.2)_0deg,transparent_60deg,rgba(168,85,247,0.2)_120deg,transparent_180deg,rgba(168,85,247,0.2)_240deg,transparent_300deg)]"
            />

            {/* Enhanced Header with floating effect */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center mb-12 relative z-10"
            >
                <motion.div
                    animate={{ 
                        y: [0, -8, 0],
                        scale: [1, 1.02, 1]
                    }}
                    transition={{ 
                        duration: 6,
                        repeat: Infinity,
                        repeatType: "mirror"
                    }}
                >
                    <motion.h1
                        initial={{ backgroundPosition: "200% 0" }}
                        animate={{ backgroundPosition: "-200% 0" }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="text-5xl font-bold bg-gradient-to-r from-purple-500 via-purple-300 to-purple-500 bg-clip-text text-transparent bg-[length:200%_auto] mb-2 drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                    >
                        Marketplace
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-purple-300/60 text-lg"
                    >
                        Discover amazing products
                    </motion.p>
                </motion.div>
            </motion.div>

            {/* Enhanced Loading State with pulsing effect */}
            <AnimatePresence mode="wait">
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex flex-col gap-4 justify-center items-center h-64"
                    >
                        <motion.div
                            animate={{ 
                                scale: [1, 1.1, 1],
                                opacity: [1, 0.8, 1]
                            }}
                            transition={{ 
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="relative"
                        >
                            <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-500 border-t-transparent"></div>
                            <div className="absolute inset-0 rounded-full border-2 border-purple-500/20"></div>
                        </motion.div>
                        <motion.p
                            animate={{ 
                                opacity: [1, 0.7, 1]
                            }}
                            transition={{ 
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="text-purple-400"
                        >
                            Loading products...
                        </motion.p>
                    </motion.div>
                )}

                {/* Enhanced Error Message with shake effect */}
                {errorMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        whileHover={{ scale: 1.02 }}
                        className="text-center p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-6 backdrop-blur-sm"
                    >
                        <motion.p
                            animate={{ x: [-2, 2, -2, 2, 0] }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-red-400 text-lg"
                        >
                            {errorMessage}
                        </motion.p>
                    </motion.div>
                )}

                {/* Enhanced Product Grid with stagger effect */}
                {!isLoading && !errorMessage && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4"
                    >
                        <AnimatePresence>
                            {products.map((product, index) => (
                                <motion.div
                                    key={product._id}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit={{ opacity: 0, y: 20 }}
                                    whileHover={{ 
                                        scale: 1.03,
                                        boxShadow: "0 8px 40px rgba(147, 51, 234, 0.2)"
                                    }}
                                    className="bg-gradient-to-br from-[#ffffff0a] to-[#ffffff05] backdrop-blur-xl border border-[#ffffff20] rounded-xl overflow-hidden transition-all duration-300 cursor-pointer group hover:border-purple-500/30"
                                    onClick={() => handleProductClick(product)}
                                >
                                    <motion.div className="relative overflow-hidden">
                                        <motion.img
                                            src={product.imgUrl}
                                            alt={product.storeName}
                                            className="w-full h-48 object-cover transition-transform duration-500"
                                            whileHover={{ scale: 1.1 }}
                                            initial={{ scale: 1.1 }}
                                            animate={{ scale: 1 }}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            whileHover={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end p-4 backdrop-blur-sm"
                                        >
                                            <div>
                                                <motion.h3 
                                                    className="text-lg font-bold text-white mb-1"
                                                    initial={{ y: 20, opacity: 0 }}
                                                    whileHover={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.1 }}
                                                >
                                                    {product.name}
                                                </motion.h3>
                                                <motion.p 
                                                    className="text-sm text-purple-300"
                                                    initial={{ y: 20, opacity: 0 }}
                                                    whileHover={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                >
                                                    {product.storeName}
                                                </motion.p>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-center">
                                            <motion.p
                                                className="text-purple-400 font-medium group-hover:text-purple-300 transition-colors"
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                Price: {product.price}
                                            </motion.p>
                                            <motion.button
                                                whileHover={{ 
                                                    scale: 1.05,
                                                    boxShadow: "0 0 20px rgba(147, 51, 234, 0.4)"
                                                }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg text-white text-sm font-medium shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300"
                                            >
                                                <motion.span
                                                    initial={{ backgroundPosition: "0% 50%" }}
                                                    whileHover={{ backgroundPosition: "100% 50%" }}
                                                    transition={{ duration: 0.3 }}
                                                    className="inline-block bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent"
                                                >
                                                    View Details
                                                </motion.span>
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Product Showcase Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <ProductShowcase product={selectedProduct} onClose={() => setSelectedProduct(null)} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default MarketplacePage;
