import { stringify } from "querystring";
import { RegisteredModel } from "../models/registered";
import { pollContest } from "../utils/mongoPolling";
import { registerContest } from "./registerContest";
import { contestModel } from "../models/contest";
import jwt from "jsonwebtoken";
import { CONTEST_SECRET } from "../server";



export async function joinPrivateContest(req:any,res:any,next:any){

    const {contest_id} = req.body;

    const contest = await contestModel.findOne({_id:contest_id,private:true});
    if(!contest){
        return res.status(404).json({message:"Not found."});
    }

    const isRegistered = await RegisteredModel.findOne({user_id:req.decoded.id, contest_id:contest_id});
    if(!isRegistered){
                return res.status().json({message:"Not Registered."});

    }
    

    let payload;

     payload = {question_set:contest.meta.question_set,start_time:contest.start_time,end_time:contest.end_time,user_id:req.decoded.id,contest_id:contest._id,contest_name:contest.meta.contest_name};

     

        const k = jwt.sign(payload,CONTEST_SECRET);
        return res.json({token:k});

    
}


