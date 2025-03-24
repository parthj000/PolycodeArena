import React from "react";
import { motion } from "framer-motion";

type LeaderboardEntry = {
    rank: number;
    name: string;
    whitehatScore: number;
    totalEarnings?: string;
    paidReports?: number;
    avatar?: string;
};

const Leaderboard = ({ data }: { data: LeaderboardEntry[] }) => {
    return (
        <div className="w-full p-6">
            <div className="bg-gradient-to-br from-[#0f1535] to-[#111c44] rounded-xl border border-[#ffffff10] backdrop-blur-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Top Performers</h2>
                <div className="space-y-4">
                    {data.map((entry) => (
                        <motion.div
                            key={entry.rank}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center bg-[#ffffff10] p-4 rounded-xl transition-all duration-300"
                        >
                            {/* Rank */}
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#0075ff] to-[#00a3ff] flex items-center justify-center text-2xl font-bold text-white">
                                #{entry.rank}
                            </div>

                            {/* Avatar and Name */}
                            <div className="flex items-center ml-4 flex-1">
                                <div className="w-12 h-12 rounded-xl bg-[#ffffff20] flex items-center justify-center overflow-hidden">
                                    {entry.avatar ? (
                                        <img src={entry.avatar} alt={entry.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-2xl">👤</span>
                                    )}
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-white">{entry.name}</h3>
                                    <p className="text-sm text-gray-400">Rank #{entry.rank}</p>
                                </div>
                            </div>

                            {/* Score */}
                            <div className="text-right">
                                <p className="text-2xl font-bold text-white">{entry.whitehatScore}</p>
                                <p className="text-sm text-gray-400">Credit Score</p>
                            </div>

                            {/* Additional Stats */}
                            {entry.totalEarnings && (
                                <div className="ml-8 text-right">
                                    <p className="text-lg font-bold text-green-400">{entry.totalEarnings}</p>
                                    <p className="text-sm text-gray-400">Earnings</p>
                                </div>
                            )}
                            {entry.paidReports && (
                                <div className="ml-8 text-right">
                                    <p className="text-lg font-bold text-blue-400">{entry.paidReports}</p>
                                    <p className="text-sm text-gray-400">Reports</p>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
