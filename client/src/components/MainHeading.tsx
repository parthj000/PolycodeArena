import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Tooltip from "./Tooltip";
import SidePanel from "./SidePanel";
import Notification from "./Notification";
import { decodeToken } from "../ts/utils/decodeToken";
import { motion } from "framer-motion";

const MainHeading = ({ data }: { data?: MainHeadingData }) => {
    const [sidePanelState, setSidePanelState] = useState<boolean>(false);
    const [notifDisplayState, setNotifDisplayState] = useState<boolean>(false);
    const [userData, setUserData] = useState<any>({});

    useEffect(() => {
        const decodeData = decodeToken();
        setUserData(decodeData);
    }, []);

    return (
        <>
            <motion.div 
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed w-full h-[60px] bg-gradient-to-r from-[#0f1535] to-[#111c44] border-b border-[#ffffff10] flex flex-row z-[100] backdrop-blur-xl"
            >
                <Link to="/" className="select-none">
                    <div className="inline-block text-[24px] font-bold italic mx-[36px] mt-[12px]">
                        <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#0075ff] to-[#00a3ff]">
                            PolyCode
                        </span>
                        <span className="text-white">Arena</span>
                    </div>
                </Link>
                {data != undefined &&
                    "items" in data &&
                    data.items != undefined &&
                    data.items.length !== 0 &&
                    data.items.map((elem) => (
                        <Link
                            to={elem.link_path}
                            className="mt-[14px] hidden md:inline-block text-[14px] h-fit p-[8px] text-gray-400 hover:text-white transition-all duration-300"
                        >
                            <div id={elem.text}>{elem.text}</div>
                        </Link>
                    ))}
                {data?.status === "loggedin" || data?.status == undefined ? (
                    <div className="fixed flex flex-row right-[36px] items-center h-[60px] space-x-4">
                        <div className="inline-block p-[5px] text-[14px] text-gray-400 md:hidden">
                            <motion.div 
                                whileHover={{ scale: 1.05 }}
                                className="w-[32px] h-[32px] border border-[#ffffff20] rounded-xl relative hover:bg-[#ffffff10] cursor-pointer transition-all duration-300"
                            >
                                <i className="bi bi-three-dots-vertical absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:text-white"></i>
                            </motion.div>
                        </div>

                        <div className="inline-block p-[5px] text-[14px] text-gray-400">
                            <Notification
                                display={notifDisplayState}
                                displayFn={setNotifDisplayState}
                            />
                        </div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="inline-block relative p-[5px] text-[14px] text-gray-400"
                            onClick={() => setSidePanelState(!sidePanelState)}
                        >
                            <Tooltip text={data?.username || "navigation"}>
                                <div className="w-[32px] h-[32px] border border-[#ffffff20] rounded-xl overflow-hidden bg-[#ffffff10]">
                                    <img
                                        src={"/profile.png"}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </Tooltip>
                        </motion.div>
                        <SidePanel
                            displayFn={setSidePanelState}
                            display={sidePanelState}
                            data={{
                                username: userData.name ? `Hello, ${userData.name}` : "",
                                role: userData.role,
                            }}
                        />
                    </div>
                ) : data?.status === "not-loggedin" ? (
                    <div className="fixed flex flex-row right-[36px] items-center h-[60px] space-x-4">
                        <Link
                            to="/login"
                            className="inline-block font-medium py-[6px] px-[16px] bg-[#ffffff10] hover:bg-[#ffffff20] border border-[#ffffff20] rounded-xl text-white text-[14px] transition-all duration-300"
                        >
                            Log In
                        </Link>
                        <Link
                            to="/signup"
                            className="inline-block font-medium py-[6px] px-[16px] bg-gradient-to-r from-[#0075ff] to-[#00a3ff] rounded-xl text-white text-[14px] hover:shadow-lg transition-all duration-300"
                        >
                            Sign Up
                        </Link>
                    </div>
                ) : (
                    <></>
                )}
            </motion.div>
            <div className="h-[60px]"></div>
        </>
    );
};

export default MainHeading;
