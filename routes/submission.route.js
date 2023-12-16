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
      // "X-RapidAPI-Key": process.env.RAPID_APIKEY,
      // "X-RapidAPI-Host": process.env.RAPID_APIHOST,
    },
    // data: {
    //   submissions: inputs.map((input, index) => ({
    //     language_id,
    //     source_code: Buffer.from(source).toString("base64"),
    //     stdin: Buffer.from(`${input[0]}\n${input[1]}`).toString("base64"),
    //     expected_output: Buffer.from(`${outputs[index]}`).toString("base64"),
    //     callback_url: `${process.env.FORWARD_URL}/callback/submissions`,
    //     cpu_time_limit: 1,
    //   })),
    // },
    data: {
      submissions: [
        {
          language_id: 46,
          source_code: "ZWNobyBoZWxsbyBmcm9tIEJhc2gK",
          callback_url: `${process.env.FORWARD_URL}/callback/submissions`,
        },
        {
          language_id: 71,
          source_code: "cHJpbnQoImhlbGxvIGZyb20gUHl0aG9uIikK",
          callback_url: `${process.env.FORWARD_URL}/callback/submissions`,
        },
        {
          language_id: 72,
          source_code: "cHV0cygiaGVsbG8gZnJvbSBSdWJ5IikK",
          callback_url: `${process.env.FORWARD_URL}/callback/submissions`,
        },
      ],
    },
  };
  try {
    const response = await axios.request(options);
    res.status(201).json(response.data);
  } catch (error) {
    console.error(error.toJSON());
  }
});

export default router;
