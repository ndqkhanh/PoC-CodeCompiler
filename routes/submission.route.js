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
  const { language_id } = req.body;
  const filepath =
    language_id === 62
      ? "codes/Main.java"
      : language_id === 71
      ? "codes/python.py"
      : "codes/cplusplus.cpp";

  const source = readFileSync(
    new URL(`../${filepath}`, import.meta.url)
  ).toString();

  const options = {
    method: "POST",
    url: `${process.env.COMPILER_URL}/submissions/batch`,
    params: {
      base64_encoded: "true",
    },
    headers: {
      "content-type": "application/json",
      "Content-Type": "application/json",
      // "X-RapidAPI-Key": process.env.RAPID_APIKEY,
      // "X-RapidAPI-Host": process.env.RAPID_APIHOST,
    },
    data: {
      submissions: inputs.map((input, index) => ({
        language_id,
        source_code: Buffer.from(source).toString("base64"),
        stdin: Buffer.from(`${input[0]}\n${input[1]}`).toString("base64"),
        expected_output: Buffer.from(`${outputs[index]}`).toString("base64"),
        callback_url: `${process.env.FORWARD_URL}/callback/submissions`,
        cpu_time_limit: 1,
      })),
    },
  };
  try {
    const response = await axios.request(options);
    res.status(201).json(response.data);
  } catch (error) {
    console.error(error.toJSON());
  }
});

router.get("/", async function (req, res) {
  const options = {
    method: "GET",
    url: `${process.env.COMPILER_URL}/submissions/batch`,
    params: {
      tokens: `${req.body.tokens[0]},${req.body.tokens[1]},${req.body.tokens[2]}`,
      base64_encoded: "false",
      fields: "*",
    },
    // headers: {
    // "X-RapidAPI-Key": process.env.RAPID_APIKEY,
    // "X-RapidAPI-Host": process.env.RAPID_APIHOST,
    // },
  };
  try {
    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error(error);
  }
});

export default router;
