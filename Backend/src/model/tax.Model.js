import { time } from "console";
import mongoose from "mongoose";

const taxSchema = mongoose.Schema(
  {
    annualIncome: {
      type: Number,
      required: true,
      min: 0,
    },
    investments: {
      type: Number,
      default: 0,
      min: 0,
    },
    otherDeductions: {
      type: Number,
      default: 0,
      min: 0,
    },
    incomeFromOtherSources: {
      type: Number,
      default: 0,
      min: 0,
    },
    taxableIncome: {
      type: Number,
      default: 0,
      min: 0,
    },
    taxPayable: {
      type: Number,
      default: 0,
      min: 0,
    },
    suggestions: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Tax = mongoose.model("Tax", taxSchema);

export { Tax };
