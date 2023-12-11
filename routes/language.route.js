import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/", async function (req, res) {
  const options = {
    method: "GET",
    url: `${process.env.COMPILER_URL}/languages`,
    headers: {
      "X-RapidAPI-Key": process.env.RAPID_APIKEY,
      "X-RapidAPI-Host": process.env.HOST,
    },
  };
  try {
    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;
