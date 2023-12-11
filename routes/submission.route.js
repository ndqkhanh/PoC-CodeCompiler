import express from "express";

const router = express.Router();

router.post("/", async function (req, res) {
  res.status(201).json([]);
});

export default router;
