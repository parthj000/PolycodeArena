import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "../App";

interface Stage {
    stage_name: string;
    stage_type: string;
    stage_id: string;
    description?: string;
    participants?: string[];
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

const RecruitmentDashboard: React.FC = () => {
    const { recruitment_id } = useParams<{ recruitment_id: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [recruitmentDrive, setRecruitmentDrive] = useState<RecruitmentDrive | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchRecruitmentDrive = async () => {
            try {
                const response = await fetch(`${API_URL}/api/community/recruitment/${recruitment_id}`, {
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
                <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0f1535] to-[#111c44] flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/20 text-red-400 p-6 rounded-xl border border-red-500/20"
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
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-br from-[#0f1535] to-[#111c44] p-8 rounded-xl border border-[#ffffff10] backdrop-blur-xl"
                        >
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent">
                                {recruitmentDrive.drive_name}
                            </h1>
                            <p className="text-gray-400 mt-4">{recruitmentDrive.description || "No description available."}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                <div className="bg-[#ffffff10] rounded-xl p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                                            🏢
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Company</p>
                                            <p className="text-white font-medium">{recruitmentDrive.company_id}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-[#ffffff10] rounded-xl p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
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
                                        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                                            🎯
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">End Date</p>
                                            <p className="text-white font-medium">
                                                {new Date(recruitmentDrive.end_date * 1000).toLocaleDateString()}
                                            </p>
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
                                className="bg-gradient-to-br from-[#0f1535] to-[#111c44] p-6 rounded-xl border border-[#ffffff10] backdrop-blur-xl"
                            >
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent mb-6">
                                    Stages
                                </h2>
                                <AnimatePresence>
                                    {recruitmentDrive.stages?.map((stage, index) => (
                                        <motion.div
                                            key={stage.stage_id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ 
                                                opacity: 1, 
                                                y: 0,
                                                transition: { delay: index * 0.1 }
                                            }}
                                            className="bg-[#ffffff10] rounded-xl p-6 mb-4 last:mb-0 hover:bg-[#ffffff15] transition-all duration-300"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-xl font-bold text-indigo-400">
                                                        {index + 1}
                                                    </div>
                                                    <h3 className="text-xl font-bold text-white">
                                                        {stage.stage_name}
                                                    </h3>
                                                </div>
                                                <span className="px-3 py-1 bg-indigo-500/10 rounded-full text-indigo-400 text-sm">
                                                    {stage.stage_type}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 text-sm mb-4">
                                                {stage.description || "No description provided."}
                                            </p>
                                            {stage.participants && stage.participants.length > 0 && (
                                                <div className="space-y-2">
                                                    <h4 className="text-indigo-400 text-sm font-medium">Participants</h4>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {stage.participants.map((participant) => (
                                                            <div 
                                                                key={participant}
                                                                className="text-gray-400 text-sm bg-indigo-500/5 rounded-lg p-2"
                                                            >
                                                                {participant}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>

                            {/* Recruitment Details Section */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="bg-gradient-to-br from-[#0f1535] to-[#111c44] p-6 rounded-xl border border-[#ffffff10] backdrop-blur-xl">
                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent mb-6">
                                        Invitation Details
                                    </h2>
                                    <div className="bg-[#ffffff10] rounded-xl p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-gray-400">Invitation Code</span>
                                            <span className="text-indigo-400 font-mono bg-indigo-500/10 px-3 py-1 rounded-lg">
                                                {recruitmentDrive.invitation_code}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ 
                                        scale: 1.02,
                                        boxShadow: "0 8px 30px rgba(99, 102, 241, 0.2)"
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={redirectToAddParticipants}
                                    className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-xl text-white font-medium transition-all duration-300 flex items-center justify-center space-x-2"
                                >
                                    <span>Add Participant</span>
                                    <span>→</span>
                                </motion.button>
                            </motion.div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-400">No recruitment drive data found.</div>
                )}
            </motion.div>
        </div>
    );
};

export default RecruitmentDashboard;
