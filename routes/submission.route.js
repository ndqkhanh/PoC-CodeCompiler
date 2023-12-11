import express from "express";
import axios from "axios";
import { readFileSync } from "fs";

const inputs = [
  [1, 42],
  [4, 23],
  [7, 10],
];

const outputs = [43, 27, 17];

const router = express.Router();

router.post("/", async function (req, res) {
  const filepath =
    req.body.language_id === 91
      ? "codes/Main.java"
      : req.body.language_id === 54
      ? "codes/cplusplus.cpp"
      : "codes/python.py";

  const source = readFileSync(
    new URL(`../${filepath}`, import.meta.url)
  ).toString();

  const options = {
    method: "POST",
    url: `${process.env.COMPILER_URL}/submissions`,
    params: {
      base64_encoded: "false",
      fields: "*",
      wait: "true",
    },
    headers: {
      "content-type": "application/json",
      "Content-Type": "application/json",
      "X-RapidAPI-Key": process.env.RAPID_APIKEY,
      "X-RapidAPI-Host": process.env.RAPID_APIHOST,
    },
    data: {
      language_id: req.body.language_id,
      source_code: source,
      stdin: "1\n2",
    },
  };
  try {
    const response = await axios.request(options);
    console.log(JSON.stringify(response.data));
  } catch (error) {
    console.error(error);
  }

  res.status(201).json([]);
});

export default router;
