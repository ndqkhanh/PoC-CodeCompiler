import express from "express";
import axios from "axios";
import { readFileSync } from "fs";

const inputs = [
  [1, 42],
  [4, 23],
  [7, 10],
];

const outputs = [43, 27, 17];

function wait(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function requestAndRetry(options) {
  let retries = 5;
  let timeout = 2000;

  while (retries > 0) {
    await wait(timeout);
    const response2 = await axios.request(options);
    const isDataReady = response2.data.submissions.every((submission) =>
      Object.values(submission).some((value) => value !== null)
    );
    if (isDataReady) {
      const data = response2.data.submissions;
      var infoTestCasePass = 0;
      data.forEach((d, i) => {
        d.pass = d.stdout == outputs[i];
        d.input = inputs[i];
        if(d.pass) 
          infoTestCasePass = infoTestCasePass + 1;
        // if(d.stdout) d.stdout = Buffer.from(d.stdout, 'base64').toString();
      });
      return {infoTestCasePass: `${infoTestCasePass}/${inputs.length}`, data};
    }
    retries--;
  }

  throw new Error(`Request failed after ${maxRetries} retries`);
}

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
          cpu_time_limit: 1,
        },
        {
          language_id: language_id,
          source_code: Buffer.from(source).toString("base64"),
          stdin: Buffer.from(`${inputs[1][0]}\n${inputs[1][1]}`).toString(
            "base64"
          ),
          cpu_time_limit: 1,
        },
        {
          language_id: language_id,
          source_code: Buffer.from(source).toString("base64"),
          stdin: Buffer.from(`${inputs[2][0]}\n${inputs[2][1]}`).toString(
            "base64"
          ),
          cpu_time_limit: 1,
        },
      ],
    },
  };
  try {
    const response = await axios.request(options);

    const options2 = {
      method: "GET",
      url: `${process.env.COMPILER_URL}/submissions/batch`,
      params: {
        tokens: `${response.data[0].token},${response.data[1].token},${response.data[2].token}`,
        base64_encoded: "false",
        fields: "stdout,time,memory,stderr,compile_output,message",
      },
      headers: {
        "X-RapidAPI-Key": process.env.RAPID_APIKEY,
        "X-RapidAPI-Host": process.env.RAPID_APIHOST,
      },
    };

    const data = await requestAndRetry(options2);
    res.status(201).json(data);
  } catch (error) {
    console.error(error);
  }
});

router.get("/", async function (req, res) {
  const options = {
    method: "GET",
    url: `${process.env.COMPILER_URL}/submissions/batch`,
    params: {
      tokens: `${req.body.tokens[0]},${req.body.tokens[1]},${req.body.tokens[2]}`,
      base64_encoded: "false",
      fields: "stdout,time,memory,stderr,compile_output,message",
    },
    headers: {
      "X-RapidAPI-Key": process.env.RAPID_APIKEY,
      "X-RapidAPI-Host": process.env.RAPID_APIHOST,
    },
  };
  try {
    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error(error);
  }
});

export default router;
