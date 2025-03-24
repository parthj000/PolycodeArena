import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "../App";

interface ProductProps {
    product: any;
    onClose: () => void;
}

const modalVariants = {
    hidden: {
        opacity: 0,
        scale: 0.8,
        y: 20,
        backdropFilter: "blur(0px)"
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        backdropFilter: "blur(8px)",
        transition: {
            type: "spring",
            damping: 25,
            staggerChildren: 0.1
        }
    },
    exit: {
        opacity: 0,
        scale: 0.8,
        y: 20,
        backdropFilter: "blur(0px)"
    }
};

const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const ProductShowcase: React.FC<ProductProps> = ({ product, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const buyProduct = async () => {
        let b = {
            id: product._id,
            name: product.storeName,
            url: product.imgUrl,
            price: product.price
        };

        if (confirm("Are you sure you want to buy this product?")) {
            try {
                setIsLoading(true);
                setError(null);
                const res = await fetch(`${API_URL}/api/user/buy`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `BEARER ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify(b)
                });

                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || "Failed to process purchase");
                }
                onClose();
                alert(data.message);
            } catch (error) {
                console.error("Error buying product:", error);
                setError(error instanceof Error ? error.message : "Failed to process purchase. Please try again.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-[#111111] border border-[#ffffff20] rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Enhanced background gradients */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-purple-600/10 to-transparent rounded-xl pointer-events-none"
                />
                <motion.div
                    initial={{ opacity: 0, rotate: 0 }}
                    animate={{ opacity: 0.1, rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(168,85,247,0.2)_0deg,transparent_60deg,rgba(168,85,247,0.2)_120deg,transparent_180deg,rgba(168,85,247,0.2)_240deg,transparent_300deg)] rounded-xl pointer-events-none"
                />

                <div className="relative">
                    <motion.div
                        variants={contentVariants}
                        className="relative rounded-lg overflow-hidden mb-6 group"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.img
                            src={product.imgUrl}
                            alt={product.name}
                            className="w-full h-64 object-cover"
                            initial={{ scale: 1.1, filter: "brightness(0.5)" }}
                            animate={{ scale: 1, filter: "brightness(1)" }}
                            transition={{ duration: 0.6 }}
                        />
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                        />
                    </motion.div>

                    <motion.button
                        whileHover={{ 
                            scale: 1.1, 
                            backgroundColor: "rgba(0, 0, 0, 0.7)",
                            boxShadow: "0 0 20px rgba(168, 85, 247, 0.3)"
                        }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="absolute top-2 right-2 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10"
                    >
                        ×
                    </motion.button>
                </div>

                <motion.div
                    variants={contentVariants}
                    className="space-y-4"
                >
                    <motion.h2
                        className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent"
                        initial={{ backgroundPosition: "200% 0" }}
                        animate={{ backgroundPosition: "-200% 0" }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                        {product.storeName}
                    </motion.h2>

                    <motion.p
                        className="text-gray-400 text-lg"
                        variants={contentVariants}
                    >
                        {product.description}
                    </motion.p>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                            >
                                <motion.p
                                    animate={{ x: [-2, 2, -2, 2, 0] }}
                                    transition={{ duration: 0.5 }}
                                    className="text-red-400"
                                >
                                    {error}
                                </motion.p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div
                        className="flex flex-wrap gap-4 items-center justify-between pt-4"
                        variants={contentVariants}
                    >
                        <motion.p
                            className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent"
                            whileHover={{ scale: 1.05 }}
                        >
                            Price: {product.price}
                        </motion.p>
                        
                        <div className="flex gap-4">
                            <motion.button
                                whileHover={{ 
                                    scale: 1.02,
                                    boxShadow: "0 5px 20px rgba(147, 51, 234, 0.3)"
                                }}
                                whileTap={{ scale: 0.98 }}
                                onClick={buyProduct}
                                disabled={isLoading}
                                className="relative px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl text-white font-medium overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <motion.div
                                    initial={false}
                                    animate={{ x: "100%" }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:opacity-100 opacity-0"
                                />
                                {isLoading ? (
                                    <motion.span 
                                        className="flex items-center gap-2"
                                        animate={{ opacity: [1, 0.7, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    >
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Processing...
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        initial={{ backgroundPosition: "0% 50%" }}
                                        whileHover={{ backgroundPosition: "100% 50%" }}
                                        transition={{ duration: 0.3 }}
                                        className="inline-block bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent"
                                    >
                                        Buy Now
                                    </motion.span>
                                )}
                            </motion.button>
                            
                            <motion.button
                                whileHover={{ 
                                    scale: 1.02, 
                                    backgroundColor: "rgba(147, 51, 234, 0.1)",
                                    borderColor: "rgba(147, 51, 234, 0.5)"
                                }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onClose}
                                className="px-6 py-2 border border-purple-500/30 rounded-xl text-purple-400 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
                            >
                                Cancel
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default ProductShowcase;
