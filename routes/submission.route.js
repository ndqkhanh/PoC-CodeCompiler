import express from "express";
import { readFileSync } from "fs";

const input = [
  [1, 42],
  [4, 23],
  [7, 10],
];

const output = [43, 27, 17];

const router = express.Router();

router.post("/", async function (req, res) {
  const filepath =
    req.body.language_id === 91
      ? "codes/Main.java"
      : req.body.language_id === 54
      ? "codes/cplusplus.py"
      : "codes/python.py";

  const source = readFileSync(new URL(`../${filepath}`, import.meta.url));

  console.log(`Language ID: ${req.language_id}`);
  console.log(`Source: ${source}`);

  res.status(201).json([]);
});

export default router;
