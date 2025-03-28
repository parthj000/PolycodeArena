import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import MainHeading from "../components/MainHeading";
import { decodeToken } from "../ts/utils/decodeToken";

const LandingPage = () => {
    const [username, setUsername] = useState<string>("");
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [decoded,setDecoded] = useState<any>({});
    const { scrollYProgress } = useScroll();

    // Parallax and animation effects
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

    useEffect(() => {
            const token = localStorage.getItem("token");
        if (token) {
                setLoggedIn(true);
            const decoded = decodeToken();
            if (decoded && decoded.name) {
                setUsername(decoded.name);
                setDecoded(decoded);
            }
        }
    }, []);

    const cardVariants = {
        offscreen: {
            y: 50,
            opacity: 0
        },
        onscreen: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                bounce: 0.4,
                duration: 0.8
            }
        }
    };
    
    return (
        <div className="min-h-screen bg-[#0a0b14] text-white overflow-x-hidden">
            {/* Grid Background */}
            <div 
                className="fixed inset-0 z-0"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: '30px 30px',
                    backgroundPosition: 'center center',
                    backgroundColor: 'rgba(0,0,0,0.9)'
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0b14] via-[#0a0b1499] to-[#0a0b14] opacity-90"></div>
            </div>

            {/* Navigation */}
            {loggedIn ? (
                <MainHeading data={{ username, status: "loggedin" }} />
            ) : (
                <MainHeading data={{ username, status: "not-loggedin" }} />
            )}

            {/* Hero Section with Enhanced Glitch Effect */}
            <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
                {/* Environment Background */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `linear-gradient(to bottom, 
                            rgba(10,11,20,0.9),
                            rgba(10,11,20,0.85)
                        ), url('/imageforus.png')`
                    }}
                >
                    {/* Colored Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-cyan-900/30 mix-blend-overlay"></div>
                    {/* Vignette Effect */}
                    <div className="absolute inset-0" style={{
                        background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.6) 100%)'
                    }}></div>
                </div>

                {/* Grid Overlay with Enhanced Animation */}
                <div 
                    className="absolute inset-0 z-[1] opacity-20"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '30px 30px',
                        animation: 'gridFloat 20s linear infinite'
                    }}
                ></div>

                {/* Content */}
                <div className="relative z-10 text-center">
                    <div className="mb-12">
                        <h1 
                            className="hero glitch layers text-[clamp(40px,10vw,100px)] leading-none inline-block text-white z-[2] tracking-[5px] filter drop-shadow-[0_5px_30px_rgba(0,117,255,0.25)] select-none font-inter font-black"
                            data-text="PolyCode"
                        >
                            <span>PolyCode</span>
                        </h1>
                        
                        <h2 
                            className="hero glitch layers mt-4 text-[clamp(30px,8vw,80px)] leading-none inline-block text-white z-[2] tracking-[10px] filter drop-shadow-[0_5px_30px_rgba(0,117,255,0.25)] select-none font-inter font-bold"
                            data-text="ARENA"
                        >
                            <span>ARENA</span>
                        </h2>
</div>

                    <motion.h3 
                        className="text-2xl md:text-3xl mb-8 text-gray-300 font-inter"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <TypeAnimation
                            sequence={[
                                `Where Innovation Meets Excellence`,
                                2000,
                                "Start Your Coding Journey",
                                2000,
                                "Join the Elite Developers",
                                2000,
                            ]}
                            wrapper="span"
                            repeat={Infinity}
                        />
                    </motion.h3>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Link
                            to={decoded?.role === "C" ? "/community/dashboard" : "/user/profile"}

                            className="inline-block font-medium py-4 px-10 bg-gradient-to-r from-[#e0287d] to-[#1bc7fb] rounded-xl text-white text-lg transition-all duration-300 transform hover:-translate-y-1 font-inter relative overflow-hidden group"
                        >
                            <span className="relative z-10">Enter Arena</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#ff3b98] to-[#00d4ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute inset-0 shadow-[0_5px_30px_rgba(224,40,125,0.5)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Link>
                    </motion.div>

                    <style>{`
                        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

                        @keyframes gridFloat {
                            0% {
                                transform: translateY(0) scale(1);
                            }
                            50% {
                                transform: translateY(-15px) scale(1.05);
                            }
                            100% {
                                transform: translateY(0) scale(1);
                            }
                        }

                        .font-inter {
                            font-family: 'Inter', sans-serif;
                        }

                        .hero {
                            filter: drop-shadow(0 1px 3px);
                            font-family: 'Inter', sans-serif;
                        }

                        .layers {
                            position: relative;
                        }

                        .layers::before,
                        .layers::after {
                            content: attr(data-text);
                            position: absolute;
                            width: 110%;
                            z-index: -1;
                        }

                        .layers::before {
                            top: 10px;
                            left: 15px;
                            color: #e0287d;
                            text-shadow: 2px 2px 20px rgba(224,40,125,0.5);
                            animation: glitch-1 5s infinite linear alternate-reverse;
                            font-weight: inherit;
                        }

                        .layers::after {
                            top: 5px;
                            left: -10px;
                            color: #1bc7fb;
                            text-shadow: -2px -2px 20px rgba(27,199,251,0.5);
                            animation: glitch-2 4s infinite linear alternate-reverse;
                            font-weight: inherit;
                        }

                        @keyframes glitch-1 {
                            0%, 100% { transform: none; opacity: 1; }
                            50% { transform: skew(-2deg, 1deg); opacity: 0.75; }
                            25%, 75% { transform: skew(1deg, -1deg); opacity: 0.9; }
                        }

                        @keyframes glitch-2 {
                            0%, 100% { transform: none; opacity: 0.9; }
                            50% { transform: skew(2deg, -1deg); opacity: 0.8; }
                            25%, 75% { transform: skew(-1deg, 1deg); opacity: 1; }
                        }

                        @keyframes paths {
                            0% {
                                clip-path: polygon(0% 43%, 83% 43%, 83% 22%, 23% 22%, 23% 24%, 91% 24%, 91% 26%, 18% 26%, 18% 83%, 29% 83%, 29% 17%, 41% 17%, 41% 39%, 18% 39%, 18% 82%, 54% 82%, 54% 88%, 19% 88%);
                            }
                            5% {
                                clip-path: polygon(0% 29%, 44% 29%, 44% 83%, 94% 83%, 94% 56%, 11% 56%, 11% 64%, 94% 64%, 94% 70%, 88% 70%);
                            }
                            30% {
                                clip-path: polygon(0% 53%, 93% 53%, 93% 62%, 68% 62%, 68% 37%, 97% 37%, 97% 89%, 13% 89%, 13% 45%, 51% 45%);
                            }
                            45% {
                                clip-path: polygon(0% 33%, 2% 33%, 2% 69%, 58% 69%, 58% 94%, 55% 94%, 55% 25%, 33% 25%, 33% 85%, 16% 85%);
                            }
                            76% {
                                clip-path: polygon(0% 26%, 15% 26%, 15% 73%, 72% 73%, 72% 70%, 77% 70%, 77% 75%, 8% 75%, 8% 42%, 4% 42%);
                            }
                            90% {
                                clip-path: polygon(0% 41%, 13% 41%, 13% 6%, 87% 6%, 87% 93%, 10% 93%, 10% 13%, 89% 13%, 89% 6%, 3% 6%);
                            }
                            1%, 7%, 33%, 47%, 78%, 93% {
                                clip-path: none;
                            }
                        }

                        @keyframes movement {
                            0% { transform: translate(-20px, 0); }
                            15% { transform: translate(10px, 10px); }
                            60% { transform: translate(-10px, 5px); }
                            75% { transform: translate(20px, -5px); }
                            100% { transform: translate(5px, 10px); }
                        }

                        @keyframes opacity {
                            0% { opacity: 0.1; }
                            5% { opacity: 0.7; }
                            30% { opacity: 0.4; }
                            45% { opacity: 0.6; }
                            76% { opacity: 0.4; }
                            90% { opacity: 0.8; }
                            1%, 7%, 33%, 47%, 78%, 93% { opacity: 0; }
                        }

                        @keyframes font {
                            0% { font-weight: 100; color: #e0287d; filter: blur(3px); }
                            20% { font-weight: 500; color: #fff; filter: blur(0); }
                            50% { font-weight: 300; color: #1bc7fb; filter: blur(2px); }
                            60% { font-weight: 700; color: #fff; filter: blur(0); }
                            90% { font-weight: 500; color: #e0287d; filter: blur(6px); }
                        }

                        .glitch span {
                            animation: paths 5s step-end infinite,
                                     glitch-opacity 4s step-end infinite;
                        }

                        @keyframes glitch-opacity {
                            0%, 100% { opacity: 1; }
                            50% { opacity: 0.9; }
                            25%, 75% { opacity: 0.8; }
                        }

                        .glitch::before {
                            animation: paths 5s step-end infinite,
                                     opacity 5s step-end infinite,
                                     font 8s step-end infinite,
                                     movement 10s step-end infinite,
                                     glitch-skew 3s infinite linear alternate-reverse;
                        }

                        .glitch::after {
                            animation: paths 5s step-end infinite,
                                     opacity 5s step-end infinite,
                                     font 7s step-end infinite,
                                     movement 8s step-end infinite,
                                     glitch-skew 2s infinite linear alternate-reverse;
                        }

                        @keyframes glitch-skew {
                            0% { transform: skew(0deg); }
                            25% { transform: skew(2deg); }
                            75% { transform: skew(-1deg); }
                            100% { transform: skew(1deg); }
                        }
                    `}</style>
                </div>
            </div>

            {/* Features Section */}
            <div className="relative py-20 px-4 bg-gradient-to-b from-[#0a0b14] to-[#111c44] ">
                <div className="max-w-7xl mx-auto">
                    <motion.h2 
                        className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-[#0075ff] to-[#00a3ff] bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Explore Our Platform
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature Card 1 */}
                        <motion.div
                            className="bg-[#ffffff08] backdrop-blur-xl rounded-2xl p-6 border border-[#ffffff10] hover:border-[#0075ff]/30 transition-all duration-300"
                            variants={cardVariants}
                            initial="offscreen"
                            whileInView="onscreen"
                            viewport={{ once: true, amount: 0.3 }}
                        >
                            <div className="relative h-48 mb-6 overflow-hidden rounded-xl">
                                <motion.img
                                    src="/pic1.png"
                                    alt="Feature 1"
                                    className="w-full h-full object-cover"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                            <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-[#0075ff] to-[#00a3ff] bg-clip-text text-transparent">
                                Interactive Learning
                            </h3>
                            <p className="text-gray-400">
                                Engage with our interactive coding challenges and real-time feedback system.
                            </p>
                        </motion.div>

                        {/* Feature Card 2 */}
                        <motion.div
                            className="bg-[#ffffff08] backdrop-blur-xl rounded-2xl p-6 border border-[#ffffff10] hover:border-[#0075ff]/30 transition-all duration-300"
                            variants={cardVariants}
                            initial="offscreen"
                            whileInView="onscreen"
                            viewport={{ once: true, amount: 0.3 }}
                        >
                            <div className="relative h-48 mb-6 overflow-hidden rounded-xl">
                                <motion.img
                                    src="/pic2.png"
                                    alt="Feature 2"
                                    className="w-full h-full object-cover"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                            <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-[#0075ff] to-[#00a3ff] bg-clip-text text-transparent">
                                Community Driven
                            </h3>
                            <p className="text-gray-400">
                                Join a thriving community of developers and learn together.
                            </p>
                        </motion.div>

                        {/* Feature Card 3 */}
                        <motion.div
                            className="bg-[#ffffff08] backdrop-blur-xl rounded-2xl p-6 border border-[#ffffff10] hover:border-[#0075ff]/30 transition-all duration-300"
                            variants={cardVariants}
                            initial="offscreen"
                            whileInView="onscreen"
                            viewport={{ once: true, amount: 0.3 }}
                        >
                            <div className="relative h-48 mb-6 overflow-hidden rounded-xl">
                                <motion.img
                                    src="/pic3.png"
                                    alt="Feature 3"
                                    className="w-full h-full object-cover"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                            <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-[#0075ff] to-[#00a3ff] bg-clip-text text-transparent">
                                Advanced Tools
                            </h3>
                            <p className="text-gray-400">
                                Access cutting-edge development tools and resources.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>

            
        </div>
    );
};

export default LandingPage;
