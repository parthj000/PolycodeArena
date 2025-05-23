import express from "express";
import { transaction } from "../controllers/transaction";
import { WalletModel } from "../models/wallet";
import { UserModel } from "../models/user";
import { RegisteredModel } from "../models/registered";


require("dotenv");

const wallet = express.Router();

wallet.post("/pay",(req:any,res:any)=>{

    const {headId,amount} = req.body;
    const tailId = req.decoded.wallet_id;

    if(!headId || !amount){
        return res.status(400).json({message:"Bad Request"})
    }
    else if(headId===tailId){
        return res.status(403).json({message:"Bad Request"})
    }

    transaction(String(headId),String(tailId),Number(amount),req,res);

})

wallet.get("/users", async (req: any, res:any ) => {
    try {
        // Fetch all users with all their fields
        const users = await UserModel.find(); // No projection, fetches all fields
        res.status(200).json({ users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Failed to fetch users." });
    }
});

wallet.get("/:wallet_id",async(req,res)=>{
    console.log(req.params.wallet_id);
    try {
    const wallet = await WalletModel.findOne({wallet_id:req.params.wallet_id});
    if(!wallet){
            return res.status(404).json({message:"Wallet not found!"})

    }
    return res.status(200).json({data:{current_balance:wallet?.current_balance,transactions:wallet?.transactions},message:"Wallet found"})
        
    } catch (error) {

            return res.status(500).json({message:"Something went wrong!"});

        
    }



})

wallet.get("/user_in/:userId",async(req,res)=>{

    console.log(req.params.userId,"kndfjkdnfkjdnfjfnjf");


try{
    const user = await UserModel.findOne({_id:req.params.userId});
    const contest = await RegisteredModel.find({user_id:req.params.userId});
    console.log(user,"this is userrrr");
    if(!user){
            return res.status(404).json({message:"User not found!"})

    }

    console.log(contest,"this is contest.");
   
    return res.status(200).json({user:user,contest:contest});
        
    } catch (error) {

            return res.status(500).json({message:"Something went wrong!"});

        
    }


})

export {wallet}