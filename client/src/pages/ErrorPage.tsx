import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface ErrorPage {
    header: string;
    message?: string;
    links?: Links[];
}

interface Links {
    text: string;
    link_path: string;
}

const ErrorPage = ({ data }: { data: ErrorPage }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f1535] to-[#111c44] font-['Inter']">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-4 left-1/2 -translate-x-1/2"
            >
                <Link to="/" className="flex items-center space-x-2">
                    <span className="text-2xl font-extrabold bg-gradient-to-r from-[#0075ff] to-[#00a3ff] bg-clip-text text-transparent">
                        Polycode
                    </span>
                    <span className="text-2xl font-bold text-white">Arena</span>
                </Link>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="fixed inset-0 flex items-center justify-center p-4"
            >
                <div className="bg-[#ffffff10] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-8 max-w-lg w-full text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold bg-gradient-to-r from-[#0075ff] to-[#00a3ff] bg-clip-text text-transparent mb-6"
                    >
                        {data.header}
                    </motion.h1>

                    {data.message && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-400 text-lg mb-8"
                        >
                            {data.message}
                        </motion.p>
                    )}

                    {data.links && data.links.length > 0 && (
                        <div className="space-y-4">
                            {data.links.map((link, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                >
                                    <Link
                                        to={link.link_path}
                                        className="inline-block px-6 py-3 bg-[#ffffff15] rounded-xl text-white font-medium hover:bg-[#ffffff20] transition-all duration-300"
                                    >
                                        {link.text}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ErrorPage;
