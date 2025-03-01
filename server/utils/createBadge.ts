import { UserModel } from "../models/user";

async function createBadge(req:any,res:any){

    // console.log(req.token);
    const user = await UserModel.findOne({email:req.decoded.email});
    console.log(req.body);
    if(user){
        user.badges?.push(req.body.url);
        await user.save();
        console.log("badge is earned succesfullyy...........");
    }

   
    return;


}

export {createBadge};