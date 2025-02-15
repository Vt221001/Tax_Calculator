import { Tax } from "../model/tax.Model.js";
import { asyncHandler } from "../utils/wrapAsync.js";
import { ApiResponse } from "../utils/responseHandler.js";

const calculateNewTax = (taxableIncome) => {
  let tax = 0;

  if (taxableIncome <= 300000) {
    tax = 0;
  } else if (taxableIncome <= 600000) {
    tax = (taxableIncome - 300000) * 0.05;
  } else if (taxableIncome <= 900000) {
    tax = 300000 * 0.05 + (taxableIncome - 600000) * 0.1;
  } else if (taxableIncome <= 1200000) {
    tax = 300000 * 0.05 + 300000 * 0.1 + (taxableIncome - 900000) * 0.15;
  } else if (taxableIncome <= 1500000) {
    tax =
      300000 * 0.05 +
      300000 * 0.1 +
      300000 * 0.15 +
      (taxableIncome - 1200000) * 0.2;
  } else {
    tax =
      300000 * 0.05 +
      300000 * 0.1 +
      300000 * 0.15 +
      300000 * 0.2 +
      (taxableIncome - 1500000) * 0.3;
  }

  return tax;
};

const generateSuggestions = (investments, otherDeductions) => {
  let suggestions = [];

  if (investments > 0) {
    suggestions.push(
      "Under the New Tax Regime, most deductions (like 80C) are not available."
    );
  }
  if (otherDeductions > 0) {
    suggestions.push(
      "Standard deduction of ₹50,000 is automatically applied under the New Regime."
    );
  }

  return suggestions;
};

export const calculateTax = asyncHandler(async (req, res) => {
  const {
    annualIncome,
    investments = 0,
    otherDeductions = 0,
    incomeFromOtherSources = 0,
  } = req.body;

  if (!annualIncome || isNaN(annualIncome)) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          null,
          "Annual Income is required and should be a valid number"
        )
      );
  }

  let taxableIncome =
    annualIncome +
    incomeFromOtherSources -
    50000 -
    investments -
    otherDeductions;
  taxableIncome = Math.max(0, taxableIncome); // Negative taxable income को 0 कर दो

  const taxPayable = calculateNewTax(taxableIncome);
  const suggestions = generateSuggestions(investments, otherDeductions);

  const taxRecord = new Tax({
    annualIncome,
    investments,
    otherDeductions,
    incomeFromOtherSources,
    taxableIncome,
    taxPayable,
    suggestions, // अब यह MongoDB में सही तरीके से Array में स्टोर होगा
  });

  await taxRecord.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { taxableIncome, taxPayable, suggestions },
        "Tax Calculated"
      )
    );
});

export const getTaxRecords = asyncHandler(async (req, res) => {
  const taxRecords = await Tax.find();

  return res
    .status(200)
    .json(new ApiResponse(200, taxRecords, "Tax Records Fetched"));
});
