import { Request, Response } from "express";
import { RecruitmentDriveModel } from "../models/recruitmentDrive";
import { UserModel } from "../models/user";
import { sendRecruitmentInvite } from "./mailerCert";

// ... other imports and functions ...

export const inviteUsers = async (req: Request, res: Response) => {
    try {
        const { recruitment_id } = req.params;
        const { 
            user_ids,
            email,
            username,
            company_name,
            drive_name,
            invitation_code
        } = req.body;

        // Debug log for request data
        console.log("=== Invite Users Debug ===");
        console.log("Request Body:", {
            recruitment_id,
            user_ids,
            email,
            username,
            company_name,
            drive_name,
            invitation_code
        });

        if (!recruitment_id || !user_ids || user_ids.length === 0) {
            console.log("Invalid parameters detected:", { recruitment_id, user_ids });
            return res.status(400).json({ message: "Invalid request parameters" });
        }

        const recruitmentDrive = await RecruitmentDriveModel.findById(recruitment_id);
        if (!recruitmentDrive) {
            console.log("Recruitment drive not found for ID:", recruitment_id);
            return res.status(404).json({ message: "Recruitment drive not found" });
        }

        // Add users to the recruitment drive
        const updatedDrive = await RecruitmentDriveModel.findByIdAndUpdate(
            recruitment_id,
            { $addToSet: { participants: { $each: user_ids } } },
            { new: true }
        );

        let emailStatus = false;
        // Send email invitation
        if (email && username && company_name && drive_name && invitation_code) {
            console.log("Attempting to send email with parameters:", {
                email,
                username,
                company_name,
                drive_name,
                invitation_code
            });
            
            emailStatus = await sendRecruitmentInvite(
                email,
                username,
                company_name,
                drive_name,
                invitation_code
            );
            
            console.log("Email sending result:", emailStatus);
        } else {
            console.log("Missing required email parameters:", {
                hasEmail: !!email,
                hasUsername: !!username,
                hasCompanyName: !!company_name,
                hasDriveName: !!drive_name,
                hasInvitationCode: !!invitation_code
            });
        }

        return res.status(200).json({
            message: emailStatus 
                ? "User successfully invited and email sent" 
                : "User invited but email could not be sent",
            emailSent: emailStatus,
            data: updatedDrive
        });
    } catch (error) {
        console.error("Detailed error in inviteUsers:");
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        return res.status(500).json({ message: "Internal server error" });
    }
}; 