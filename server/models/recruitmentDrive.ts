import mongoose, { Schema, Document } from "mongoose";

interface IStage {
    stage_name: string;
    stage_type: string;
    stage_id?: string;
    description?: string;
    participants?: string[];
}

interface IRecruitmentDrive extends Document {
    meta: {
        drive_name: string;
        invitation_code: string;
        stages: IStage[];
        company_id: string;
        start_date: number;
        end_date: number;
        description?: string;
    };
    start_date: number;
    end_date: number;
}

const StageSchema: Schema = new Schema<IStage>({
    stage_name: { type: String, required: true },
    stage_type: { type: String, required: true },
    stage_id: { type: String },
    description: { type: String },
    participants: { type: [String], default: [] },
});

const RecruitmentDriveSchema: Schema = new Schema<IRecruitmentDrive>({
    meta: {
        drive_name: { type: String, required: true },
        invitation_code: { type: String, required: true, unique: true },
        stages: { type: [StageSchema], required: true },
        company_id: { type: String, required: true },
        start_date: { type: Number, required: true },
        end_date: { type: Number, required: true },
        description: { type: String },
    },
    start_date: { type: Number, required: true },
    end_date: { type: Number, required: true },
}, { timestamps: true });

export const RecruitmentDriveModel = mongoose.model<IRecruitmentDrive>("RecruitmentDrive", RecruitmentDriveSchema);
