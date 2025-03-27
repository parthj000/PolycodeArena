import { quizModel } from "../models/quiz";
import { QuizRegisteredModel } from "../models/quizRegistered";
import { QUIZ_SECRET } from "../server";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

interface QuizPayload {
    question_set: any; // Replace 'any' with your actual question set type
    start_time: number;
    end_time: number;
    user_id: string;
    quiz_id: string;
    quiz_name: string | undefined;
}

interface DecodedRequest extends Request {
    decoded?: {
        id: string;
    };
}

async function registerQuiz(req: DecodedRequest, res: Response) {
    const { quiz_id, invitation_code } = req.body;

    if (!quiz_id || !invitation_code) {
        return res.status(400).json({ message: "All parameters are required." });
    }

    try {
        const quiz = await quizModel.findOne({ _id: quiz_id });
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found." });
        } else if (invitation_code !== quiz.meta.invitation_code) {
            return res.status(403).json({ message: "Incorrect invitation code." });
        }

        if (!req.decoded?.id) {
            return res.status(401).json({ message: "Unauthorized: No user ID found." });
        }

        // Generate payload for JWT token
        const payload: QuizPayload = {
            question_set: quiz.meta.question_set,
            start_time: quiz.start_time,
            end_time: quiz.end_time,
            user_id: req.decoded.id,
            quiz_id: quiz._id.toString(),
            quiz_name: quiz.meta.quiz_name,
        };

        // Sign the JWT token
        const regToken = jwt.sign(payload, String(QUIZ_SECRET));

        const registered = await QuizRegisteredModel.findOne({ 
            user_id: req.decoded.id, 
            quiz_id: quiz._id 
        });
        
        if (registered) {
            return res.status(200).json({ message: "User already registered.", token: regToken });
        }

        const regUser = new QuizRegisteredModel({
            quiz_name: quiz.meta.quiz_name,
            quiz_id: quiz._id,
            user_id: req.decoded.id,
        });
        await regUser.save();

        return res.status(200).json({ message: "User registered successfully.", token: regToken });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
}

export { registerQuiz };