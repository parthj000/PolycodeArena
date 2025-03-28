import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "../App";


const LoginPage = () => {
    const [usernameOrEmail, setUsernameOrEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("U"); // Default role
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleLogin = async () => {
        setIsLoading(true);
        setMessage(""); // Clear previous messages

        if (!usernameOrEmail || !password) {
            setMessage("Please fill in all fields.");
            setIsLoading(false);
            return;
        }

        // Prepare payload for login request
        
        const payload = {
            email: usernameOrEmail,
            password: password,
            role: role,
        };

        try {
            // Simulate login request using POST
            let urlPoint ;
            role==="C"?urlPoint="community":urlPoint="user"
            
            const res = await fetch(`${API_URL}api/${urlPoint}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            // Check if the response is okay
            const data = await res.json();

            if (res.status === 200) {
                setMessage("Login successful! Redirecting...");
                localStorage.setItem("token", data.token);
                if(role==="C"){
                    navigate("/community/dashboard");

                }
                else{
                    navigate("/leaderboard");

                }
                
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error("Login failed:", error);
            setMessage("An error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#111111] p-4 sm:p-6 md:p-8 font-['Inter'] relative overflow-hidden">
            {/* Animated background elements */}
            <motion.div
                
                className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-transparent"
            />
            <motion.div
                
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent"
            />

            <Link to={"/"}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-center mb-8 relative z-10"
                >
                    <motion.h1
                        initial={{ backgroundPosition: "200% 0" }}
                        animate={{ backgroundPosition: "0% 0" }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="text-4xl font-bold bg-gradient-to-r from-purple-500 via-purple-300 to-purple-500 bg-clip-text text-transparent bg-[length:200%_auto]"
                    >
                        PolyCode Arena
                    </motion.h1>
                </motion.div>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-md mx-auto relative z-10"
            >
                <motion.div
                    whileHover={{ boxShadow: "0 8px 40px rgba(147, 51, 234, 0.1)" }}
                    className="bg-gradient-to-r from-[#ffffff0a] to-[#ffffff05] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
                >
                    <motion.h2
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                        className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent text-center mb-8"
                    >
                        Login
                    </motion.h2>

                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                        >
                            <input
                                type="text"
                                placeholder="Username or Email"
                                value={usernameOrEmail}
                                onChange={(e) => setUsernameOrEmail(e.target.value)}
                                className="w-full bg-[#ffffff0a] border border-[#ffffff20] rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:bg-[#ffffff15] transition-all duration-300"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.5 }}
                        >
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#ffffff0a] border border-[#ffffff20] rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:bg-[#ffffff15] transition-all duration-300"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.6 }}
                        >
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full bg-[#ffffff0a] border border-[#ffffff20] rounded-xl p-3 text-white focus:outline-none focus:border-purple-500/50 focus:bg-[#ffffff15] transition-all duration-300"
                            >
                                <option value="C" className="bg-[#111111]">Admin</option>
                                <option value="U" className="bg-[#111111]">Participant</option>
                            </select>
                        </motion.div>

                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: "0 5px 20px rgba(147, 51, 234, 0.3)" }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.7 }}
                            onClick={handleLogin}
                            disabled={isLoading}
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-400 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
                        >
                            <motion.div
                                initial={false}
                                animate={{ x: "100%" }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 group-hover:opacity-100 opacity-0"
                            />
                            {isLoading ? (
                                <div className="flex justify-center items-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                </div>
                            ) : (
                                "Login"
                            )}
                        </motion.button>

                        <AnimatePresence mode="wait">
                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={`text-center text-sm ${
                                        message.includes("successful")
                                            ? "text-green-400"
                                            : "text-red-400"
                                    }`}
                                >
                                    {message}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.8 }}
                    className="text-center mt-6"
                >
                    <span className="text-gray-400">Don't have an account? </span>
                    <Link
                        to="/signup"
                        className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-300"
                    >
                        Sign up
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
