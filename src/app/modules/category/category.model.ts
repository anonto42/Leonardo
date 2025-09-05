import { Schema, model, Model } from "mongoose";
import { ICategory } from "./category.interface";
import { TCategoryCoinAcction } from "../../../enums/category";

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name must be at most 50 characters"],
    },
    action: {
      type: String,
      enum: Object.values(TCategoryCoinAcction),
      required: [true, "Category action is required"],
    },
    coin: {
      type: Number,
      required: [true, "Category coin is required"],
      min: [0, "Coin must be at least 0"],
    },
    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, 
    versionKey: false, 
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
      },
    },
  }
);

categorySchema.index({ name: 1 },{ unique: true });

export const Category: Model<ICategory> = model<ICategory>("Category", categorySchema);