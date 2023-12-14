import express from "express";
import dotenv from "dotenv";

import submissionRouter from "./routes/submission.route.js";
import languageRouter from "./routes/language.route.js";
import submissionCallbackRouter from "./routes/submission_callback.route.js";

const app = express();
app.use(express.json());
dotenv.config();

app.use("/api/submissions", submissionRouter);
app.use("/api/languages", languageRouter);

app.use("/callback/submissions", submissionCallbackRouter);

app.use(function (req, res) {
  res.status(404).json({
    error: "Endpoint not found.",
  });
});

app.use(function (err, req, res, next) {
  console.log(err.stack);
  res.status(500).json({
    error: "Something wrong!",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Sakila API is listening at http://localhost:${PORT}`);
});
