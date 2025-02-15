import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import { errorHandler } from "./middleware/errorHandler.js";
import { taxRouter } from "./Routes/tax.routes.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: 'https://tax.vedanshtiwari.tech',
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", taxRouter);

app.get("/", (req, res) => {
  res, send("welcome to Tax Calculator");
});

app.use(errorHandler);

export default app;
