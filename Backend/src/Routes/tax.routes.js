import express from "express";
import { calculateTax, getTaxRecords } from "../Controller/tax.controller.js";
const router = express.Router();

router.post("/tax-calculate", calculateTax);
router.get("/get-all-taxes", getTaxRecords);

export { router as taxRouter };
