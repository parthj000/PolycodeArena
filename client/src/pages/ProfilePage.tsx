import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "../App";
import { decodeToken } from "../ts/utils/decodeToken";

interface Transaction {
    head: string;
    tail: string;
    amount: number;
    description: string;
    timestamp: string;
}

interface Contest {
    contest_id: string;
    contest_name: string;
}

interface UserData {
    name: string;
    profile_pic: string;
    resume_url: string;
    tag: string;
    badges: string[];
    wallet_id: string;
}

interface WalletData {
    current_balance: number;
    transactions: Transaction[];
}

interface WalletResponse {
    data: WalletData;
    message: string;
}

const ProfilePage = () => {
    const [userData, setUserData] = useState<UserData>({
        name: "",
        profile_pic: "",
        resume_url: "",
        tag: "",
        badges: [],
        wallet_id: "",
    });
    const [contests, setContests] = useState<Contest[]>([]);
    const [showAllBadges, setShowAllBadges] = useState<boolean>(false);
    const [walletData, setWalletData] = useState<WalletData>({
        current_balance: 0,
        transactions: [],
    });

    useEffect(() => {
        const fetchUserAssets = async () => {
            try {
                const user = decodeToken();
                const token = localStorage.getItem("token");
                if (!token || !user?.id) return;

                const response = await fetch(`${API_URL}/api/wallet/user_in/${user.id}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const responseData = await response.json();
                const { user: userData, contest: contestData } = responseData;

                setUserData({
                    name: userData.name,
                    profile_pic: userData.profile_pic,
                    resume_url: userData.resume_url,
                    tag: userData.tag,
                    badges: userData.badges || [],
                    wallet_id: userData.wallet_id,
                });

                setContests(contestData || []);

                // Fetch wallet data
                const walletResponse = await fetch(`${API_URL}/api/wallet/${userData.wallet_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const walletResponseData: WalletResponse = await walletResponse.json();
                setWalletData(walletResponseData.data);
            } catch (error) {
                console.error("Error fetching user assets:", error);
            }
        };

        fetchUserAssets();
    }, []);

    const handleResumeDownload = () => {
        if (userData.resume_url) {
            window.open(userData.resume_url, "_blank");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f1535] to-[#111c44] p-6 text-white">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-[#ffffff0a] to-[#ffffff05] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-6"
                >
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <motion.img
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            src={userData.profile_pic}
                            alt="Profile"
                            className="w-32 h-32 rounded-xl border border-[#ffffff30] object-cover shadow-lg"
                        />
                        <div className="text-center md:text-left">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent">
                                {userData.name}
                            </h2>
                            <p className="text-lg text-gray-400 mt-2">Tag: {userData.tag}</p>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleResumeDownload}
                                className="mt-4 px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-xl text-white font-medium hover:from-indigo-500 hover:to-indigo-300 transition-all duration-300"
                            >
                                Download Resume
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Badges Section */}
                {/* <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-[#ffffff0a] to-[#ffffff05] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-6"
                >
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent mb-6">
                        Badges & Achievements
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {userData.badges.slice(0, showAllBadges ? undefined : 6).map((badge, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="aspect-square relative group"
                                >
                                    <img
                                        src={badge}
                                        alt={`Badge ${index + 1}`}
                                        className="w-full h-full rounded-xl object-cover border border-[#ffffff30] transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-end p-4">
                                        <p className="text-sm font-medium text-white">Badge #{index + 1}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                    {userData.badges.length > 6 && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowAllBadges(!showAllBadges)}
                            className="mt-6 px-6 py-2 bg-[#ffffff15] rounded-xl text-white font-medium hover:bg-[#ffffff20] transition-all duration-300 mx-auto block"
                        >
                            {showAllBadges ? "Show Less" : "Show More"}
                        </motion.button>
                    )}
                </motion.div> */}

                {/* Contests Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-[#ffffff0a] to-[#ffffff05] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-6"
                >
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent mb-6">
                        Contest History
                    </h3>
                    <div className="grid gap-4">
                        {contests.map((contest, index) => (
                            <motion.div
                                key={contest.contest_id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-[#ffffff10] rounded-xl p-4 flex items-center justify-between"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-xl font-bold text-indigo-400">
                                        #{index + 1}
                                    </div>
                                    <h4 className="text-lg font-medium text-white">
                                        {contest.contest_name}
                                    </h4>
                                </div>
                            </motion.div>
                        ))}
                        {contests.length === 0 && (
                            <p className="text-center text-gray-400 py-4">No contests participated yet</p>
                        )}
                    </div>
                </motion.div>

                {/* Wallet Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-[#ffffff0a] to-[#ffffff05] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent">
                            Wallet Details
                        </h3>
                        <div className="bg-[#ffffff10] px-4 py-2 rounded-xl">
                            <span className="text-gray-400">Status: </span>
                            <span className="text-green-400">Active</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Balance Card */}
                        <div className="bg-[#ffffff10] rounded-xl p-6 flex flex-col justify-between">
                            <p className="text-gray-400 text-sm">Current Balance</p>
                            <div className="mt-2">
                                <p className="text-3xl font-bold text-green-400">
                                    {walletData.current_balance}
                                </p>
                                <p className="text-sm text-gray-400 mt-1">arena_coins</p>
                            </div>
                        </div>

                        {/* Wallet ID Card */}
                        <div className="bg-[#ffffff10] rounded-xl p-6">
                            <p className="text-gray-400 text-sm">Wallet ID</p>
                            <div className="mt-2 font-mono flex items-center space-x-2">
                                <p className="text-white text-sm truncate">{userData.wallet_id}</p>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => navigator.clipboard.writeText(userData.wallet_id)}
                                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                    </svg>
                                </motion.button>
                            </div>
                        </div>

                        {/* QR Code Card */}
                        <div className="bg-[#ffffff10] rounded-xl p-6 flex items-center justify-center">
                            <QRCode
                                value={`${window.location.origin}/user/pay/${userData.wallet_id}`}
                                bgColor="#000000"
                                fgColor="#ffffff"
                                size={120}
                                className="rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Transactions Section */}
                    <div className="mt-8">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-xl font-bold text-indigo-400">Recent Transactions</h4>
                            <div className="bg-[#ffffff10] px-4 py-2 rounded-xl">
                                <span className="text-gray-400">Total: </span>
                                <span className="text-white">{walletData.transactions.length}</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {walletData.transactions.map((tx, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-[#ffffff10] rounded-xl p-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-gray-400 text-sm">From</p>
                                            <p className="font-mono text-white text-sm mt-1 truncate" title={tx.head}>
                                                {tx.head === "U" ? "You" : tx.head}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">To</p>
                                            <p className="font-mono text-white text-sm mt-1 truncate" title={tx.tail}>
                                                {tx.tail === "U" ? "You" : tx.tail}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Amount</p>
                                            <p className="font-bold text-green-400 mt-1">
                                                {tx.amount.toFixed(2)} coins
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Date</p>
                                            <p className="text-white text-sm mt-1">
                                                {new Date(tx.timestamp).toLocaleDateString()} {new Date(tx.timestamp).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                    {tx.description && (
                                        <div className="mt-3 pt-3 border-t border-[#ffffff20]">
                                            <p className="text-gray-400 text-sm">Description</p>
                                            <p className="text-white text-sm mt-1">{tx.description}</p>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                            {walletData.transactions.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-400">No transactions yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfilePage;