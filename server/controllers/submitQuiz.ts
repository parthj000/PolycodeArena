import { quizModel } from "../models/quiz";
import jwt from "jsonwebtoken";
import { QUIZ_SECRET } from "../server";
import { Request, Response } from "express";

interface Question {
  correct_option: string;
  // Add other question properties if needed
}

interface QuizMeta {
  question_set: Question[];
  invitation_code?: string;
  quiz_name: string;
  // Add other meta properties if needed
}

interface QuizDocument extends Document {
  meta: QuizMeta;
  rankings?: Rankings;
  start_time: number;
  end_time: number;
  markModified(path: string): void;
  save(): Promise<this>;
}

interface RankingEntry {
  user_id: string;
  name: string;
  marks: Record<string, number>;
  total_marks: number;
  wallet_id: string;
}

interface Rankings {
  [userId: string]: RankingEntry;
}

interface QuizTokenPayload {
  question_set: Question[];
  start_time: number;
  end_time: number;
  user_id: string;
  quiz_id: string;
  quiz_name: string;
}

interface DecodedUser {
  id: string;
  wallet_id: string;
  name: string;
}

interface DecodedRequest extends Request {
  decoded?: DecodedUser;
  body: {
    quiz_token?: string;
    answers?: Record<string, string>;
  };
}

function updateRankings(
  rankings: Rankings,
  userId: string,
  questionId: number,
  isCorrect: boolean,
  walletId: string,
  userName: string
): Rankings {
  const user = rankings[userId];

  if (!user) {
    rankings[userId] = {
      user_id: userId,
      name: userName,
      marks: { [questionId]: isCorrect ? 1 : 0 },
      total_marks: isCorrect ? 1 : 0,
      wallet_id: walletId,
    };
    return rankings;
  }

  const marks = user.marks;
  const existingMark = marks[questionId] ?? 0;

  if (existingMark < (isCorrect ? 1 : 0)) {
    user.total_marks += (isCorrect ? 1 : 0) - existingMark;
    marks[questionId] = isCorrect ? 1 : 0;
  }

  user.wallet_id = walletId;
  user.name = userName;

  return rankings;
}

function sortRankings(rankings: Rankings): Rankings {
  return Object.entries(rankings)
    .sort(([, a], [, b]) => b.total_marks - a.total_marks)
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Rankings);
}

async function submitQuiz(req: DecodedRequest, res: Response) {
  const { quiz_token, answers } = req.body;

  if (!quiz_token || !answers) {
    return res.status(400).json({ message: "All fields are required." });
  }

  let verify: QuizTokenPayload;
  try {
    verify = jwt.verify(quiz_token, QUIZ_SECRET as string) as QuizTokenPayload;
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }

  if (verify.end_time < Date.now() / 1000) {
    return res.status(402).json({ message: "This quiz is over now." });
  }

  try {
    const quiz = await quizModel.findById(verify.quiz_id).exec() as QuizDocument | null;
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found." });
    }

    const questionSet = quiz.meta.question_set;
    const user = req.decoded;
    if (!user) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    let correctAnswersCount = 0;
    const currentRankings = quiz.rankings || {};

    Object.entries(answers).forEach(([questionIndex, userAnswer]) => {
      const index = parseInt(questionIndex);
      const question = questionSet[index];
      const isCorrect = question?.correct_option === userAnswer;
      
      if (isCorrect) {
        correctAnswersCount++;
      }

      updateRankings(
        currentRankings,
        user.id,
        index,
        isCorrect,
        user.wallet_id,
        user.name
      );
    });

    quiz.rankings = sortRankings(currentRankings);
    quiz.markModified("rankings");
    await quiz.save();

    return res.status(200).json({
      message: "Quiz submitted successfully.",
      correctAnswers: correctAnswersCount,
      totalQuestions: questionSet.length,
    });
  } catch (error) {
    console.error("Error during quiz submission:", error);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export { submitQuiz };