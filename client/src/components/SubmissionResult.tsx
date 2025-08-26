"use client";
import { motion } from "framer-motion";

interface TestCase {
  Input: any[];
  Expected_out: any[];
  correct: number;
  user_prints: string;
  Output: any[];
}

interface Result {
  stdout?: TestCase[];
  stderr?: string;
  marks?: number;
}

export default function SubmissionResult({ result }: { result: Result }) {
  if (result.stderr) {
    return (
      <div className="p-6 bg-gradient-to-br from-red-500/20 to-red-500/10 border border-red-400/30 text-red-300 rounded-xl backdrop-blur-md overflow-scroll">
        <h2 className="font-bold text-lg mb-2">Error</h2>
        <pre className="whitespace-pre-wrap text-sm">{result.stderr}</pre>
      </div>
    );
  }

  if (result.stdout) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent">
          Test Case Results
        </h2>

        <div className="grid gap-4">
          {result.stdout.map((tc, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-gradient-to-br from-[#ffffff0a] to-[#ffffff05] border border-[#ffffff20] backdrop-blur-md shadow-sm"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-white/90">
                  Case {idx + 1}
                </span>
                {tc.correct ? (
                  <span className="text-green-400 font-bold">Passed</span>
                ) : (
                  <span className="text-red-400 font-bold">Failed</span>
                )}
              </div>

              <div className="text-sm space-y-2 text-gray-300">
                <p>
                  <span className="text-indigo-300 font-medium">Input:</span>{" "}
                  <span className="bg-[#ffffff15] rounded-lg px-2 py-1">
                    {JSON.stringify(tc.Input).slice(1,-1)}
                  </span>
                </p>
                <p>
                  <span className="text-indigo-300 font-medium">Expected:</span>{" "}
                  <span className="bg-[#ffffff15] rounded-lg px-2 py-1">
                    {JSON.stringify(tc.Expected_out).slice(1,-1)}
                  </span>
                </p>
                <p>
                  <span className="text-indigo-300 font-medium">Output:</span>{" "}
                  <span className="bg-[#ffffff15] rounded-lg px-2 py-1">
                    {JSON.stringify(tc.Output).slice(1,-1)}
                  </span>
                </p>
                {tc.user_prints && (
                  <p>
                    <span className="text-indigo-300 font-medium">
                      User Prints:
                    </span>{" "}
                    <span className="bg-[#ffffff15] rounded-lg px-2 py-1">
                      {tc.user_prints}
                    </span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-gradient-to-br from-[#ffffff0a] to-[#ffffff05] border border-[#ffffff20] rounded-xl backdrop-blur-md">
          <span className="font-semibold text-indigo-300">Total Marks: </span>
          <span className="text-white font-bold">{result.marks}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#ffffff05] rounded-xl text-gray-300">
      <h1 className="text-lg font-semibold"></h1>
    </div>
  );
}
