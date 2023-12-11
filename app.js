import express from "express";

import submissionRouter from "./routes/submission.route.js";
import languageRouter from "./routes/language.route.js";

const app = express();
app.use(express.json());

app.use("/api/submissions", submissionRouter);
app.use("/api/languages", languageRouter);

app.get("/err", function (req, res) {
  throw new Error("Error!");
});

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
