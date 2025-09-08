import { model, Schema } from "mongoose";
import { ITask, TaskModel } from "./task.interface";

const taskSchema = new Schema<ITask>({
    category:{
        type: Schema.ObjectId,
        ref: "Category"
    },
    taskName:{
        type: String,
        default: "Default"
    },
    isComplete:{
        type: Boolean,
        default: false
    },
    isInStrick:{
        type: Boolean,
        default: false
    },
    watchTime:{
        type: Number,
        default: 0
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    selectDate:{
        type: Date,
        default: null
    },
    selectTime:{
        type: Date,
        default: null
    }
},{
    timestamps: true,
    versionKey: false
});

export const Task = model<ITask, TaskModel>("Task", taskSchema);