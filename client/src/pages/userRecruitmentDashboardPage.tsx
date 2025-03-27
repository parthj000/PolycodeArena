import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "../App";

interface Stage {
    stage_name: string;
    stage_type: string;
    stage_id: string;
    description?: string;
}

interface RecruitmentDrive {
    drive_name: string;
    invitation_code: string;
    stages: Stage[];
    company_id: string;
    start_date: number;
    end_date: number;
    description?: string;
}

const UserRecruitmentDashboard: React.FC = () => {
    const { recruitment_id } = useParams<{ recruitment_id: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [recruitmentDrive, setRecruitmentDrive] = useState<RecruitmentDrive | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchRecruitmentDrive = async () => {
            try {
                const response = await fetch(`${API_URL}/api/user/recruitment/${recruitment_id}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    setError(`Failed to fetch recruitment data: ${errorData.message}`);
                    setLoading(false);
                    return;
                }

                const data = await response.json();
                const formattedDrive = {
                    drive_name: data.recruitmentDrive.meta.drive_name,
                    invitation_code: data.recruitmentDrive.meta.invitation_code,
                    stages: data.recruitmentDrive.meta.stages.map((stage: any) => ({
                        ...stage,
                        stage_id: stage._id,
                    })),
                    company_id: data.recruitmentDrive.meta.company_id,
                    start_date: data.recruitmentDrive.meta.start_date,
                    end_date: data.recruitmentDrive.meta.end_date,
                    description: data.recruitmentDrive.meta.description,
                };

                setRecruitmentDrive(formattedDrive);
            } catch (err) {
                console.error("Error fetching recruitment drive:", err);
                setError("An error occurred while fetching the recruitment data.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecruitmentDrive();
    }, [recruitment_id]);

    const redirectToAddParticipants = () => {
        if (recruitment_id) {
            navigate(`/community/recruitment/${recruitment_id}/inviteusers`);
        } else {
            setError("Recruitment ID is missing.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0f1535] to-[#111c44] flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center space-y-4"
                >
                    <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                    <p className="text-indigo-400">Loading recruitment drive...</p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0f1535] to-[#111c44] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/20 text-red-400 p-6 rounded-xl border border-red-500/20 max-w-md w-full text-center"
                >
                    {error}
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f1535] to-[#111c44] p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
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

                {recruitmentDrive ? (
                    <div className="space-y-8">
                        {/* Header with Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-br from-[#0f1535] to-[#111c44] p-8 rounded-xl border border-[#ffffff10] backdrop-blur-xl mb-8"
                        >
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent">
                                {recruitmentDrive.drive_name}
                            </h1>
                            <p className="text-gray-400 mt-2">{recruitmentDrive.description || "No description available."}</p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                <div className="bg-[#ffffff10] rounded-xl p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-xl">
                                            🎯
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Total Stages</p>
                                            <p className="text-white font-medium">{recruitmentDrive.stages.length}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-[#ffffff10] rounded-xl p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-xl">
                                            📅
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Start Date</p>
                                            <p className="text-white font-medium">
                                                {new Date(recruitmentDrive.start_date * 1000).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-[#ffffff10] rounded-xl p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-xl">
                                            🏢
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Company</p>
                                            <p className="text-white font-medium">{recruitmentDrive.company_id}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Stages Section */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-gradient-to-br from-[#0f1535] to-[#111c44] rounded-xl border border-[#ffffff10] backdrop-blur-xl overflow-hidden"
                            >
                                <div className="p-6">
                                    <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent mb-6">
                                        Recruitment Stages
                                    </h2>
                                    <div className="space-y-4">
                                        <AnimatePresence>
                                            {recruitmentDrive.stages?.map((stage, index) => (
                                                <motion.div
                                                    key={stage.stage_id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -20 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="bg-[#ffffff10] rounded-xl overflow-hidden hover:bg-[#ffffff15] transition-all duration-300"
                                                >
                                                    <div className="p-6">
                                                        <div className="flex items-center space-x-4">
                                                            <motion.div 
                                                                className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-2xl"
                                                                whileHover={{ scale: 1.1 }}
                                                            >
                                                                #{index + 1}
                                                            </motion.div>
                                                            <div className="flex-1">
                                                                <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent">
                                                                    {stage.stage_name}
                                                                </h3>
                                                                <div className="flex items-center space-x-2 mt-1">
                                                                    <span className="px-3 py-1 bg-indigo-500/20 rounded-full text-indigo-400 text-sm">
                                                                        {stage.stage_type}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-400 text-sm mt-4">
                                                            {stage.description || "No description provided."}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Drive Details Section */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-gradient-to-br from-[#0f1535] to-[#111c44] rounded-xl border border-[#ffffff10] backdrop-blur-xl overflow-hidden"
                            >
                                <div className="p-6">
                                    <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent mb-6">
                                        Drive Details
                                    </h2>
                                    <div className="space-y-4">
                                        <div className="bg-[#ffffff10] rounded-xl p-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-400">Invitation Code</span>
                                                    <span className="text-indigo-400 font-medium bg-indigo-500/10 px-4 py-2 rounded-lg">
                                                        {recruitmentDrive.invitation_code}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-400">Company ID</span>
                                                    <span className="text-indigo-400 font-medium">
                                                        {recruitmentDrive.company_id}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-400">Start Date</span>
                                                    <span className="text-green-400 font-medium">
                                                        {new Date(recruitmentDrive.start_date * 1000).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-400">End Date</span>
                                                    <span className="text-red-400 font-medium">
                                                        {new Date(recruitmentDrive.end_date * 1000).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-400 py-12">No recruitment drive data found.</div>
                )}
            </motion.div>
        </div>
    );
};

export default UserRecruitmentDashboard;
