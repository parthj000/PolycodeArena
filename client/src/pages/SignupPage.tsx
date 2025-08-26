import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "../App";


const SignupPage = () => {
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [collegeYear, setCollegeYear] = useState<number | "">("");
    const [cgpa, setCgpa] = useState<number | "">("");
    const [tag, setTag] = useState("");
    const [description, setDescription] = useState("");
    const [resume, setResume] = useState<File | null>(null);
    const [profilePic, setProfilePic] = useState<File | null>(null);
    const [certificates, setCertificates] = useState<File[]>([]);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const predefinedTags = [
        "Backend Development",
        "UI/UX Designer",
        "DevOps",
        "Data Science",
        "AI/ML",
        "Full Stack Development",
        "Frontend Development",
    ];

    const handleFileChange = (
        setter: React.Dispatch<React.SetStateAction<File | null>>,
        files: FileList | null
    ) => {
        if (files && files.length > 0) {
            setter(files[0]);
        }
    };

    const handleMultipleFileChange = (
        setter: React.Dispatch<React.SetStateAction<File[]>>,
        files: FileList | null
    ) => {
        if (files) {
            setter(Array.from(files));
        }
    };

    const handleSignUp = async () => {
        setIsLoading(true);

        if (password !== confirmPassword) {
            setMessage("Passwords do not match. Please try again.");
            setIsLoading(false);
            return;
        }

        const participantPayload = {
            name: username,
            email: email,
            password: password,
            collegeYear: Number(collegeYear),
            cgpa: Number(cgpa),
            tag: tag,
            description: description,
            contentType: profilePic?.type,
        };

        const payload =
            role === "participant"
                ? participantPayload
                : { name: username, email, password };

        try {
            const url =
                role === "community"
                    ? `${API_URL}api/community/signup`
                    : `${API_URL}api/user/unverified-signup`;

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Something went wrong");
            }

            const data = await res.json();
            setMessage(data.message);

            if (role === "participant" && data.urls && data.urls.length > 0) {
                const signedUrls = data.urls;
                const urlsMap = signedUrls.reduce(
                    (map: {
                        profilePicUrl: any;
                        resumeUrl: any;
                        certificateUrls: any[];
                    }, { key, url }: any) => {
                        if (key.includes("profile_pic")) {
                            map.profilePicUrl = url;
                        } else if (key.includes("resume")) {
                            map.resumeUrl = url;
                        } else if (key.includes("certificate")) {
                            map.certificateUrls = map.certificateUrls || [];
                            map.certificateUrls.push(url);
                        }
                        return map;
                    },
                    {} as {
                        profilePicUrl?: string;
                        resumeUrl?: string;
                        certificateUrls?: string[];
                    }
                );

                const uploadPromises: Promise<any>[] = [];

                if (profilePic && urlsMap.profilePicUrl) {
                    uploadPromises.push(
                        uploadFileToS3(profilePic, urlsMap.profilePicUrl)
                    );
                }

                if (resume && urlsMap.resumeUrl) {
                    uploadPromises.push(
                        uploadFileToS3(resume, urlsMap.resumeUrl)
                    );
                }

                if (certificates.length > 0 && urlsMap.certificateUrls) {
                    certificates.forEach((certificate, index) => {
                        const certificateUrl = urlsMap.certificateUrls[index];
                        if (certificateUrl) {
                            uploadPromises.push(
                                uploadFileToS3(certificate, certificateUrl)
                            );
                        }
                    });
                }

                await Promise.all(uploadPromises);
                setMessage("Signup successful !");
            }
        } catch (error: any) {
            setMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const uploadFileToS3 = async (file: File, url: string) => {
        try {
            const res = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": file.type,
                    "Content-Disposition": "inline",
                },
                body: file,
            });

            if (!res.ok) {
                throw new Error("File upload failed");
            }
        } catch (error: any) {
            throw new Error(`Failed to upload file: ${error.message}`);
        }
    };

    const inputClasses = "w-full bg-[#ffffff0a] border border-[#ffffff20] rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:bg-[#ffffff15] transition-all duration-300";
    const labelClasses = "block mb-2 text-gray-400 text-sm font-medium";
    const fileInputClasses = "w-full bg-[#ffffff0a] border border-[#ffffff20] rounded-xl p-3 text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-purple-600 file:to-purple-400 file:text-white hover:file:shadow-lg file:transition-all file:duration-300 transition-all duration-300";

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
                className="max-w-2xl mx-auto relative z-10"
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
                        Create Account
                    </motion.h2>

                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                        >
                            <input
                                className={inputClasses}
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.5 }}
                        >
                            <input
                                className={inputClasses}
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.6 }}
                        >
                            <select
                                className={inputClasses}
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="" disabled className="bg-[#111111]">Select Role</option>
                                <option value="community" className="bg-[#111111]">Community</option>
                                <option value="participant" className="bg-[#111111]">Participant</option>
                            </select>
                        </motion.div>

                        <AnimatePresence mode="wait">
                            {role === "participant" && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-6"
                                >
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <select
                                            className={inputClasses}
                                            value={collegeYear}
                                            onChange={(e) => setCollegeYear(Number(e.target.value))}
                                        >
                                            <option value="" disabled className="bg-[#111111]">Select College Year</option>
                                            {[1, 2, 3, 4].map((year) => (
                                                <option key={year} value={year} className="bg-[#111111]">
                                                    {year}
                                                </option>
                                            ))}
                                        </select>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <input
                                            className={inputClasses}
                                            type="number"
                                            step="0.01"
                                            placeholder="CGPA"
                                            value={cgpa}
                                            onChange={(e) => setCgpa(Number(e.target.value))}
                                        />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <select
                                            className={inputClasses}
                                            value={tag}
                                            onChange={(e) => setTag(e.target.value)}
                                        >
                                            <option value="" disabled className="bg-[#111111]">Select Tag</option>
                                            {predefinedTags.map((tag) => (
                                                <option key={tag} value={tag} className="bg-[#111111]">
                                                    {tag}
                                                </option>
                                            ))}
                                        </select>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <textarea
                                            className={inputClasses}
                                            placeholder="Description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            rows={4}
                                        />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <label className={labelClasses}>Upload Resume (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => handleFileChange(setResume, e.target.files)}
                                            className={fileInputClasses}
                                        />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <label className={labelClasses}>Upload Profile Picture</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(setProfilePic, e.target.files)}
                                            className={fileInputClasses}
                                        />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <label className={labelClasses}>Upload Certificates</label>
                                        <input
                                            type="file"
                                            accept=".pdf,.png,.jpg,.jpeg"
                                            multiple
                                            onChange={(e) => handleMultipleFileChange(setCertificates, e.target.files)}
                                            className={fileInputClasses}
                                        />
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.7 }}
                        >
                            <input
                                className={inputClasses}
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.8 }}
                        >
                            <input
                                className={inputClasses}
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </motion.div>

                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: "0 5px 20px rgba(147, 51, 234, 0.3)" }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.9 }}
                            onClick={handleSignUp}
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
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                </div>
                            ) : (
                                "Create Account"
                            )}
                        </motion.button>

                        <AnimatePresence mode="wait">
                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={`text-center text-sm ${
                                        message.includes("successful") ? "text-green-400" : "text-red-400"
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
                    transition={{ duration: 0.4, delay: 1 }}
                    className="text-center mt-6"
                >
                    <span className="text-gray-400">Already have an account? </span>
                    <Link
                        to="/login"
                        className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-300"
                    >
                        Sign in
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default SignupPage;
