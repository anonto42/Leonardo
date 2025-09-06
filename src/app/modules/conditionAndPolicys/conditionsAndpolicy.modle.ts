import { model, Model, Schema } from "mongoose";
import { TCondition } from "../../../types/condition";

export interface ICondition {
    content: string,
    type: TCondition
}

const conditionSchema = new Schema<ICondition>({
    content:{
        type: String,
        default: ""
    },
    type:{
        type: String,
        required: true
    }
},{
    timestamps: true
})

export const Condition: Model<ICondition> = model<ICondition>("Conditions", conditionSchema)