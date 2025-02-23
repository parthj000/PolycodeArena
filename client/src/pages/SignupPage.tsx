import { useState } from "react";
import { Link } from "react-router-dom";

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
                    ? "http://localhost:8080/api/community/signup"
                    : "http://localhost:8080/api/user/unverified-signup";

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

            // If role is "participant", proceed with file uploads
            if (role === "participant" && data.urls && data.urls.length > 0) {
                const signedUrls = data.urls;

                // Create a map of file type URLs
                const urlsMap = signedUrls.reduce(
                    (
                        map: {
                            profilePicUrl: any;
                            resumeUrl: any;
                            certificateUrls: any[];
                        },
                        { key, url }: any
                    ) => {
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

                // Upload profile picture, resume, and certificates to the pre-signed URLs
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
                        } else {
                            console.warn(
                                "No certificate URL found for index:",
                                index
                            );
                        }
                    });
                }

                // Wait for all file uploads to complete
                await Promise.all(uploadPromises);

                setMessage("Signup successful. Please Wait for Verification");
            }
        } catch (error: any) {
            setMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Function to upload a file to S3 using the pre-signed URL
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

    return (
        <>
            <Link to={"/"}>
                <div
                    id="logo-cont"
                    className="inline-block relative text-[24px] left-1/2 -translate-x-1/2 font-bold italic mx-auto mt-[12px]"
                >
                    <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-orange-600 px-[1px]">
                        PolyCode
                    </span>
                    <span>Arena</span>
                </div>
            </Link>
            <div className="min-h-fit w-[500px] mx-auto text-[14px]">
                <div className="relative bg-black shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h2 className="text-[34px] font-bold mb-[30px] text-center mt-[60px]">
                        Sign Up
                    </h2>
                    <div className="mb-4">
                        <input
                            className="appearance-none border w-full py-2 px-3 bg-black rounded border-borders leading-tight focus:outline-none"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            className="appearance-none border w-full py-2 px-3 bg-black rounded border-borders leading-tight focus:outline-none"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4 relative">
                        <select
                            className="appearance-none border w-full py-2 px-3 bg-black rounded border-borders leading-tight focus:outline-none"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="" disabled>
                                Select Role
                            </option>
                            <option value="community">Community</option>
                            <option value="participant">Participant</option>
                        </select>
                    </div>
                    {role === "participant" && (
                        <>
                            <div className="mb-4">
                                <select
                                    className="appearance-none border w-full py-2 px-3 bg-black rounded border-borders leading-tight focus:outline-none"
                                    value={collegeYear}
                                    onChange={(e) =>
                                        setCollegeYear(Number(e.target.value))
                                    }
                                    required
                                >
                                    <option value="" disabled>
                                        Select College Year
                                    </option>
                                    {[1, 2, 3, 4].map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <input
                                    className="appearance-none border w-full py-2 px-3 bg-black rounded border-borders leading-tight focus:outline-none"
                                    type="number"
                                    step="0.01"
                                    placeholder="CGPA"
                                    value={cgpa}
                                    onChange={(e) =>
                                        setCgpa(Number(e.target.value))
                                    }
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <select
                                    className="appearance-none border w-full py-2 px-3 bg-black rounded border-borders leading-tight focus:outline-none"
                                    value={tag}
                                    onChange={(e) => setTag(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>
                                        Select Tag
                                    </option>
                                    {predefinedTags.map((tag) => (
                                        <option key={tag} value={tag}>
                                            {tag}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <textarea
                                    className="appearance-none border w-full py-2 px-3 bg-black rounded border-borders leading-tight focus:outline-none"
                                    placeholder="Description"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    required
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 text-gray-400">
                                    Upload Resume
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) =>
                                        handleFileChange(
                                            setResume,
                                            e.target.files
                                        )
                                    }
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 text-gray-400">
                                    Upload Profile Picture
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        handleFileChange(
                                            setProfilePic,
                                            e.target.files
                                        )
                                    }
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 text-gray-400">
                                    Upload Certificates
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf,.png,.jpg,.jpeg"
                                    multiple
                                    onChange={(e) =>
                                        handleMultipleFileChange(
                                            setCertificates,
                                            e.target.files
                                        )
                                    }
                                />
                            </div>
                        </>
                    )}
                    <div className="mb-4">
                        <input
                            className="appearance-none border w-full py-2 px-3 bg-black rounded border-borders leading-tight focus:outline-none"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <input
                            className="appearance-none border w-full py-2 px-3 bg-black rounded border-borders leading-tight focus:outline-none"
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        className="bg-orange-500 hover:bg-red-600 text-black font-bold py-[6px] px-4 rounded focus:outline-none w-full"
                        type="button"
                        onClick={handleSignUp}
                    >
                        {isLoading ? (
                            <div className="block h-[21px]">Loading...</div>
                        ) : (
                            "Create Account"
                        )}
                    </button>
                    <div className="flex items-center justify-between mt-[20px]">
                        <span>Already have an account? </span>
                        <Link
                            to="/login"
                            className="text-orange-500 hover:text-red-600"
                        >
                            Login
                        </Link>
                    </div>
                    <div className="text-center mt-[20px] text-red-600 w-full">
                        {message}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignupPage;
