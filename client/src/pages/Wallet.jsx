import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { decodeToken } from "../ts/utils/decodeToken";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../App";
import { motion, AnimatePresence } from "framer-motion";

const WalletPage = () => {
    const navigate = useNavigate();
    const [walletId, setWalletId] = useState("");
    const [data, setData] = useState();
    const [isModalOpen, setModalOpen] = useState(false);
    const [receiverWalletId, setReceiverWalletId] = useState("");

    useEffect(() => {
        const decoded = decodeToken();
        if (!decoded.wallet_id) {
            navigate("Login");
        }

        setWalletId(decoded.wallet_id);

        const fetchWallet = async () => {
            const res = await fetch(`${API_URL}/api/wallet/${decoded.wallet_id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await res.json();
            const mainJson = data.data;
            if (!mainJson) {
                console.log("Something went wrong!");
            }
            setData(mainJson);
        };

        fetchWallet();
    }, [navigate]);

    const handlePay = () => {
        if (!receiverWalletId.trim()) {
            alert("Wallet ID cannot be empty!");
            return;
        }
        navigate(`/${window.location.pathname.split("/")[1]}/pay/${receiverWalletId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f1535] to-[#111c44] p-8 font-['Inter']">
            {data && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-7xl mx-auto"
                >
                    {/* Top Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        {/* Balance Card */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="lg:col-span-2 bg-[#ffffff10] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-8"
                        >
                            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#0075ff] to-[#00a3ff] bg-clip-text text-transparent mb-2">
                                {data.current_balance} arena_coins
                            </h2>
                            <p className="text-gray-400">Wallet ID: {walletId}</p>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setModalOpen(true)}
                                className="mt-6 px-6 py-3 bg-gradient-to-r from-[#0075ff] to-[#00a3ff] rounded-xl text-white font-medium hover:shadow-lg transition-all duration-300"
                            >
                                Pay
                            </motion.button>
                        </motion.div>

                        {/* QR Code Card */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-[#ffffff10] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-8 flex items-center justify-center"
                        >
                            <QRCode
                                value={`${window.location.origin}/user/pay/${walletId}`}
                                bgColor="#0f1535"
                                fgColor="#fff"
                                size={200}
                            />
                        </motion.div>
                    </div>

                    {/* Transactions Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#ffffff10] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-8"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">Transactions</h2>
                        <div className="space-y-4">
                            {data.transactions && data.transactions.map((tx, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-[#ffffff10] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-4"
                                >
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-gray-400">From</p>
                                            <p className="text-white font-medium truncate">{tx.head}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400">To</p>
                                            <p className="text-white font-medium truncate">{tx.tail}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400">Amount</p>
                                            <p className="text-white font-medium">${tx.amount.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Payment Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                        onClick={() => setModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#ffffff10] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-8 max-w-md w-full mx-4"
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 className="text-2xl font-bold text-white mb-6">Enter Wallet ID</h3>
                            <input
                                type="text"
                                value={receiverWalletId}
                                onChange={(e) => setReceiverWalletId(e.target.value)}
                                placeholder="Enter Wallet ID"
                                className="w-full px-4 py-3 bg-[#ffffff10] border border-[#ffffff20] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#0075ff] transition-all duration-300 mb-6"
                            />
                            <div className="flex space-x-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setModalOpen(false)}
                                    className="flex-1 px-6 py-3 bg-[#ffffff20] rounded-xl text-white font-medium hover:bg-[#ffffff30] transition-all duration-300"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handlePay}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#0075ff] to-[#00a3ff] rounded-xl text-white font-medium hover:shadow-lg transition-all duration-300"
                                >
                                    Pay
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WalletPage;
