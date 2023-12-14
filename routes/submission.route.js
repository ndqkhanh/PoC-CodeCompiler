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
  const {language_id} = req.body;
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
      base64_encoded: "false"
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
          source_code: source,
          stdin: `${inputs[0][0]}\n${inputs[0][1]}`,
          cpu_time_limit: 1,
        },
        {
          language_id: language_id,
          source_code: source,
          stdin: `${inputs[1][0]}\n${inputs[1][1]}`,
          cpu_time_limit: 1,
        },
        {
          language_id: language_id,
          source_code: source,
          stdin: `${inputs[2][0]}\n${inputs[2][1]}`,
          cpu_time_limit: 1,
        }
      ]
    }
  };
  try {
    const response = await axios.request(options);

    const options2 = {
      method: 'GET',
      url: `${process.env.COMPILER_URL}/submissions/batch`,
      params: {
        tokens: ``,
        base64_encoded: 'false',
        fields: 'stdout,time,memory,stderr,compile_output,message'
      },
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_APIKEY,
        'X-RapidAPI-Host': process.env.RAPID_APIHOST
      }
    };
    var count = 0;
    var tokens = response.data;
    var outputData = []
    while(count < 10 ){
      await new Promise(r => setTimeout(r, 1000));//sleep 1s
      options2.params.tokens = toStringTokenList(tokens);

      const response2 = await axios.request(options2);
      const data = response2.data.submissions;
      data.forEach ((d, i)=>{
        if(!Object.values(d).every(x => x===null))
        {
          d.pass = (d.stdout == outputs[i]);
          tokens.splice(i, 1);
        }
      })
      res.json(data)

      count++
    }
  } catch (error) {
    console.error(error);
  }

  
});
const toStringTokenList = (tokens)=>{
  var str = '';
  tokens.forEach(token=>{
    str = str + `${token},`;
  })
  if(str.length > 0)
    str = str.slice(0, -1);
  return str;
}

export default router;
