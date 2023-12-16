import express from "express";
import axios from "axios";

const router = express.Router();

router.put("/", async function (req, res) {
  const { token } = JSON.parse(JSON.stringify(req.body));
  console.log("token", token);
  if (typeof token === "string") {
    const options = {
      method: "GET",
      url: `${process.env.COMPILER_URL}/submissions/${token}`,
      params: {
        base64_encoded: "false",
        fields: "*",
      },
    };
    try {
      const response = await axios.request(options);
      console.log(response.data);
      res.status(200).json();
    } catch (error) {
      console.error(error);
    }
  }
});

export default router;
