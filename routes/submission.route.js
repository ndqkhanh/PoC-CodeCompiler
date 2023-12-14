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
    language_id === 91
      ? "codes/Main.java"
      : language_id === 54
      ? "codes/cplusplus.cpp"
      : "codes/python.py";

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
      "X-RapidAPI-Key": process.env.RAPID_APIKEY,
      "X-RapidAPI-Host": process.env.RAPID_APIHOST,
    },
    data: {
      submissions: [
        {
          language_id: language_id,
          source_code: Buffer.from(source).toString("base64"),
          stdin: Buffer.from(`${inputs[0][0]}\n${inputs[0][1]}`).toString(
            "base64"
          ),
          expected_output: Buffer.from(`${outputs[0]}`).toString("base64"),
          callback_url:
            "https://3n2h512t-3000.asse.devtunnels.ms/callback/submissions",
          cpu_time_limit: 1,
        },
        {
          language_id: language_id,
          source_code: Buffer.from(source).toString("base64"),
          stdin: Buffer.from(`${inputs[1][0]}\n${inputs[1][1]}`).toString(
            "base64"
          ),
          callback_url:
            "https://3n2h512t-3000.asse.devtunnels.ms/callback/submissions",
          expected_output: Buffer.from(`${outputs[1]}`).toString("base64"),
          cpu_time_limit: 1,
        },
        {
          language_id: language_id,
          source_code: Buffer.from(source).toString("base64"),
          stdin: Buffer.from(`${inputs[2][0]}\n${inputs[2][1]}`).toString(
            "base64"
          ),
          callback_url:
            "https://3n2h512t-3000.asse.devtunnels.ms/callback/submissions",
          expected_output: Buffer.from(`${outputs[2]}`).toString("base64"),
          cpu_time_limit: 1,
        },
      ],
    },
  };
  try {
    const response = await axios.request(options);
    res.status(201).json(response.data);
  } catch (error) {
    console.error(error);
  }
});

export default router;
