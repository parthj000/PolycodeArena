import { useEffect, useState } from "react"; 
import ReactCodeMirror from "@uiw/react-codemirror";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import { API_URL } from "../App";
import { motion, AnimatePresence } from "framer-motion";
import SubmissionResult from "../components/SubmissionResult";

interface TestCase {
    input: any;
    expected_output: any;
}

interface Question {
    question_text: string;
    question_description: string;
    test_cases: {
        public: TestCase[];
    };
}

interface SubmissionOutput {
    input: string;
    expected_output: string;
    actual_output: string;
    is_correct: boolean;
    execution_time: number;
    error: string;
}

interface SubmissionResult {
    message: string;
    output: SubmissionOutput[];
    iscorrect: boolean;
    marks: number;
}

interface ProblemSetProps {
    questions: Question[];
    initialCode?: string;
    token: string;
    setOutput: (output: string) => void;
}

const ProblemSet = ({
    questions,
    initialCode = "",
    token,
    setOutput,
}: ProblemSetProps) => {
    const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [code, setCode] = useState<string>(initialCode);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submissionResult, setSubmissionResult] = useState<any>({});

    useEffect(()=>{
        console.log(questions[0]["test_cases"]["public"][0]);
    if(questions[0]["test_cases"]["public"][0]){
        let cs = questions[0]["test_cases"]["public"][0];
        let input_size = cs.input.length;
        
        let str = ""
        for(let i=0;i<input_size;i++){
            str = str +"," + `input_${i+1}`
        }
        str = str.slice(1);
        let cd = `def kapa(${str}):
    """
     Write your logic here.
    """
    return output
    
    `

         setCode(cd)
        
    }
    },[])

    const handleSubmit = async () => {
        console.log("ksdnkdsjfdsklfndslkfsdlfkdsmf")
        if (selectedQuestion === null) {
            alert("Please select a problem that you are solving in the problem statements section.")
            return;
        }
        else if(!code){
            alert("Write code before submitting.")
            return;
        }
        setIsSubmitting(true);
        try {
            const contest_token = token;
            const question_id = Number(selectedQuestion) + 1;

            const response = await fetch(`${API_URL}api/user/submit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    contest_token: contest_token,
                    question_id: question_id,
                    code: code,
                }),
            });

            const data = await response.json();
            setSubmissionResult(data);
            setOutput(data.output?.[0]?.actual_output || "No output provided");
        } catch (error) {
            console.error("Submission Error:", error);
            alert("There was an error submitting your code.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className=" kapa h-screen bg-gradient-to-br from-[#0f1535] to-[#111c44] text-white flex flex-col lg:flex-row overflow-hidden">
            {/* Left Side: Problem List or Problem Details */}
            <div className="w-full lg:w-1/3 border-r border-[#ffffff20] h-full flex flex-col overflow-hidden">
                <AnimatePresence mode="wait">
                    {selectedQuestion === null ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="p-6 h-full overflow-y-auto"
                        >
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent mb-6">
                                Problem Statements
                            </h2>
                            <div className="space-y-4">
                                {questions.map((question, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`bg-gradient-to-br from-[#ffffff0a] to-[#ffffff05] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-6 cursor-pointer hover:border-indigo-500/30 transition-all duration-300 ${
                                            hoveredIndex === index ? "transform scale-[1.02]" : ""
                                        }`}
                                        onMouseEnter={() => setHoveredIndex(index)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                        onClick={() => setSelectedQuestion(index)}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-2xl font-bold text-indigo-400">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">
                                                    {question.question_text}
                                                </h3>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="p-6 h-full overflow-y-auto"
                        >
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="mb-6 px-4 py-2 bg-[#ffffff15] rounded-xl text-white font-medium hover:bg-[#ffffff20] transition-all duration-300 flex items-center space-x-2"
                                onClick={() => setSelectedQuestion(null)}
                            >
                                <span>←</span>
                                <span>Back to Problems</span>
                            </motion.button>

                            <div className="bg-gradient-to-br from-[#ffffff0a] to-[#ffffff05] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-6">
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent mb-4">
                                    {questions[selectedQuestion].question_text}
                                </h2>
                                <div className="prose prose-invert max-w-none">
                                    <p className="text-gray-300 mb-6">
                                        {questions[selectedQuestion].question_description}
                                    </p>
                                </div>

                                <div className="mt-8">
                                    <h3 className="text-xl font-bold text-indigo-400 mb-4">Test Cases</h3>
                                    <div className="space-y-4">
                                        {questions[selectedQuestion].test_cases.public.map((testCase, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="bg-[#ffffff10] rounded-xl p-4"
                                            >
                                                <div className="mb-2">
                                                    <span className="text-indigo-400 font-medium">Input:</span>
                                                    <pre className="mt-1 p-2 bg-[#ffffff15] rounded-lg overflow-x-auto">
                                                        {JSON.stringify(testCase.input).slice(1,-1)}
                                                    </pre>
                                                </div>
                                                <div>
                                                    <span className="text-indigo-400 font-medium">Expected Output:</span>
                                                    <pre className="mt-1 p-2 bg-[#ffffff15] rounded-lg overflow-x-auto">
                                                        {JSON.stringify(testCase.expected_output).slice(1,-1)}
                                                    </pre>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Right Side: Code Editor and Results */}
            <div className="w-full lg:w-1/3 h-full flex flex-col bg-[black]">
                
                    <ReactCodeMirror
                                value={code}
                                extensions={[loadLanguage("python")!]}
                                // theme={tokyoNight}
                                theme={'dark'}
                                onChange={(value) => setCode(value)}
                                className="h-[100%] rounded-lg"
                            />

                <div className="p-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full py-3 rounded-xl font-bold transition-all duration-300 ${
                            isSubmitting
                                ? "bg-gray-600 cursor-not-allowed"
                                : "bg-gradient-to-r from-indigo-600 to-indigo-400 hover:from-indigo-500 hover:to-indigo-300"
                        }`}
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                <span>Submitting...</span>
                            </div>
                        ) : (
                            "Submit Code"
                        )}
                    </motion.button>
                </div>

                
            </div>

            <div className="bg-gradient-to-br  from-[#ffffff0a] to-[#ffffff05] backdrop-blur-xl border border-[#ffffff20] rounded-xl p-6 w-full lg:w-1/3 h-full flex flex-col">
                                <h4 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent mb-6">
                                    Submission Results
                                </h4>
                                <SubmissionResult result={submissionResult} />
                                
                            </div>

        </div>
    );
};

export default ProblemSet;
