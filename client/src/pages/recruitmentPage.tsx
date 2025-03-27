import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const RecruitmentPage: React.FC = () => {
    const [recruitments, setRecruitments] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecruitments = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/community/recruitment/all", {
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch recruitment drives");
                }

                const data = await response.json();
                setRecruitments(data);
            } catch (err) {
                console.error("Error fetching recruitment drives:", err);
                setError("Could not fetch recruitment drives.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecruitments();
    }, []);

    const handleViewDetails = (recruitmentId: string) => {
        navigate(`/community/recruitment/${recruitmentId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f1535] to-[#111c44] p-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto"
            >
                {/* Animated Background Elements */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ 
                        opacity: [0.1, 0.2, 0.1],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{ 
                        duration: 5,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                    className="fixed inset-0 pointer-events-none"
                    style={{
                        background: "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)",
                        zIndex: 0
                    }}
                />

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-[#0f1535] to-[#111c44] p-6 rounded-xl border border-[#ffffff10] backdrop-blur-xl hover:border-indigo-500/30 transition-all duration-300"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl">
                                🎯
                            </div>
                            <div>
                                <p className="text-gray-400">Total Drives</p>
                                <motion.h3 
                                    className="text-2xl font-bold text-white"
                                    initial={{ scale: 1 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    {recruitments.length}
                                </motion.h3>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-[#0f1535] to-[#111c44] p-6 rounded-xl border border-[#ffffff10] backdrop-blur-xl hover:border-green-500/30 transition-all duration-300"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-2xl">
                                🚀
                            </div>
                            <div>
                                <p className="text-gray-400">Active Drives</p>
                                <motion.h3 
                                    className="text-2xl font-bold text-white"
                                    initial={{ scale: 1 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    {recruitments.filter(r => new Date(r.end_date) > new Date()).length}
                                </motion.h3>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-[#0f1535] to-[#111c44] p-6 rounded-xl border border-[#ffffff10] backdrop-blur-xl hover:border-indigo-500/30 transition-all duration-300"
                    >
                <Link
                    to="/community/recruitment/create"
                            className="flex items-center space-x-4 group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-2xl group-hover:bg-indigo-500/30 transition-all duration-300">
                                ➕
                            </div>
                            <div>
                                <p className="text-gray-400">Create New</p>
                                <motion.h3 
                                    className="text-xl font-bold text-white"
                                    initial={{ scale: 1 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    Start Drive
                                </motion.h3>
                            </div>
                </Link>
                    </motion.div>
                </div>

                {/* Error Display */}
                <AnimatePresence>
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-red-500/20 text-red-400 p-4 rounded-xl mb-6"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Loading State */}
                {isLoading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-center items-center h-64"
                    >
                        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                    </motion.div>
                ) : (
                    <div className="bg-gradient-to-br from-[#0f1535] to-[#111c44] rounded-xl border border-[#ffffff10] backdrop-blur-xl overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-white mb-6">Recruitment Drives</h2>
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {recruitments.map((drive, index) => (
                                        <motion.div
                                            key={drive._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="bg-[#ffffff10] rounded-xl overflow-hidden hover:bg-[#ffffff15] transition-all duration-300"
                                            onClick={() => handleViewDetails(drive._id)}
                                        >
                                            <div className="p-6 cursor-pointer">
                                                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                                    <div className="flex items-center space-x-4 flex-1">
                                                        <motion.div 
                                                            className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-2xl"
                                                            whileHover={{ scale: 1.1 }}
                                                        >
                                                            #{index + 1}
                                                        </motion.div>
                                                        <div className="flex-1">
                                                            <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent">
                                                                {drive.drive_name}
                                                            </h3>
                                                            <p className="text-gray-400 text-sm mt-1">
                                                                {drive.description || "No description available"}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-4 items-center">
                                                        <div className="flex items-center space-x-2 bg-indigo-500/10 px-3 py-1 rounded-full">
                                                            <span className="text-indigo-400">Company:</span>
                                                            <span className="text-white">{drive.company_id}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2 bg-green-500/10 px-3 py-1 rounded-full">
                                                            <span className="text-green-400">Start:</span>
                                                            <span className="text-white">
                                                                {new Date(drive.start_date).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center space-x-2 bg-red-500/10 px-3 py-1 rounded-full">
                                                            <span className="text-red-400">End:</span>
                                                            <span className="text-white">
                                                                {new Date(drive.end_date).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <motion.div
                                                            whileHover={{ scale: 1.1, x: 5 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center"
                                                        >
                                                            <span className="text-indigo-400">→</span>
                                                        </motion.div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default RecruitmentPage;
