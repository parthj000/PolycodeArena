import React, { Dispatch, SetStateAction, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";
import { motion, AnimatePresence } from "framer-motion";

// SidePanelItem component for rendering individual links
const SidePanelItem = ({
    text,
    to,
    icon,
    style,
}: {
    text: string;
    to: string;
    icon: string;
    style?: React.CSSProperties;
}) => {
    return (
        <motion.div
            whileHover={{ x: 5 }}
            className="w-full"
        >
            <Link
                to={to}
                className="flex items-center space-x-3 w-[88%] mx-auto my-[8px] rounded-xl hover:bg-[#ffffff10] py-[10px] px-[16px] text-[14px] text-gray-400 hover:text-white transition-all duration-300"
                style={style}
            >
                <span className="text-xl">{icon}</span>
                <span>{text}</span>
            </Link>
        </motion.div>
    );
};

// SidePanel component with role-based links for admin and user
const SidePanel = ({
    displayFn,
    display,
    data,
}: {
    display: boolean;
    displayFn: Dispatch<SetStateAction<boolean>>;
    data: SidePanelData;
}) => {
    const [logoutState, setLogoutState] = useState<boolean>(false);
    const navigate = useNavigate();

    const onLogout = async () => {
        const token = await localStorage.getItem("token");
        if (token) {
            await localStorage.removeItem("token");
        }
        navigate("/");
        window.location.reload();
    };

    // Mock links for admin and user with icons
    const adminLinks = [
        { text: "Leaderboard", to: "/community/dashboard", icon: "🏆" },
        { text: "Contests", to: "/community/contest", icon: "🎯" },
        { text: "Quizzes", to: "/community/quizzes", icon: "❓" },
        { text: "Marketplace", to: "/community/marketplace", icon: "🏪" },
        { text: "Wallet", to: "/community/wallet", icon: "💰" },
    ];

    const userLinks = [
        { text: "Leaderboard", to: "/leaderboard", icon: "🏆" },
        { text: "Wallet", to: "/user/wallet", icon: "💰" },
        { text: "Contests", to: "/user/contests", icon: "🎯" },
        { text: "Quizzes", to: "/user/quiz", icon: "❓" },
        { text: "Profile", to: "/user/profile", icon: "👤" },
    ];

    const links = data.role === "C" ? adminLinks : userLinks;

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: display ? 1 : 0 }}
                onClick={() => displayFn(false)}
                className={`w-screen h-screen ${display ? "fixed" : "hidden"} top-0 left-0 z-[80] backdrop-blur-sm bg-black/50`}
            />
            <motion.div
                initial={{ x: 320 }}
                animate={{ x: display ? 0 : 320 }}
                transition={{ type: "spring", damping: 20 }}
                className="fixed z-[90] right-0 top-0 h-screen w-[320px] bg-gradient-to-b from-[#0f1535] to-[#111c44] border-l border-[#ffffff10] backdrop-blur-xl"
            >
                <div className="relative h-[100px] border-b border-[#ffffff10]">
                    <div className="absolute top-[24px] left-[24px] flex items-center space-x-4">
                        <div className="w-[40px] h-[40px] rounded-xl border border-[#ffffff20] overflow-hidden bg-[#ffffff10]">
                            <img
                                src={"/profile.png"}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="text-[16px] font-medium text-white">
                            {data.username || "Hello friend"}
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => displayFn(false)}
                        className="absolute right-[24px] top-[24px] w-[32px] h-[32px] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#ffffff10] rounded-xl transition-all duration-300"
                    >
                        <i className="bi bi-x-lg"></i>
                    </motion.button>
                </div>

                <div className="py-6 space-y-2">
                    {links.map((link) => (
                        <SidePanelItem
                            key={link.text}
                            text={link.text}
                            to={link.to}
                            icon={link.icon}
                        />
                    ))}
                </div>

                <div className="absolute bottom-0 w-full p-6 border-t border-[#ffffff10]">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-[10px] px-[16px] bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-xl transition-all duration-300"
                        onClick={() => setLogoutState(true)}
                    >
                        Log out
                    </motion.button>
                </div>

                <ConfirmModal
                    display={logoutState}
                    displayFn={setLogoutState}
                    onOkFn={onLogout}
                    title="Log Out"
                    message={`Are you sure you want to log out of ${data.username}?`}
                />
            </motion.div>
        </>
    );
};

export default SidePanel;
