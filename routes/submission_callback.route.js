import express from "express";

const router = express.Router();

router.put("/", async function (req, res) {
  try {
    let submissionBatchResult = JSON.parse(JSON.stringify(req.body, null, 2));
    submissionBatchResult = {
      ...submissionBatchResult,
      source_code:
        submissionBatchResult.source_code !== null
          ? Buffer.from(submissionBatchResult.source_code, "base64").toString(
              "ascii"
            )
          : null,
      stdin:
        submissionBatchResult.stdin !== null
          ? Buffer.from(submissionBatchResult.stdin, "base64").toString("ascii")
          : null,
      stdout:
        submissionBatchResult.stdout !== null
          ? Buffer.from(submissionBatchResult.stdout, "base64").toString(
              "ascii"
            )
          : null,
      expected_output:
        submissionBatchResult.expected_output !== null
          ? Buffer.from(
              submissionBatchResult.expected_output,
              "base64"
            ).toString("ascii")
          : null,
      compile_output:
        submissionBatchResult.compile_output !== null
          ? Buffer.from(
              submissionBatchResult.compile_output,
              "base64"
            ).toString("ascii")
          : null,
    };
    submissionBatchResult.pass =
      submissionBatchResult.stdout === submissionBatchResult.expected_output;
    console.log("submissionBatchResult", submissionBatchResult);
    console.log(
      "========================================================================"
    );
    res.status(200).json();
  } catch (error) {
    console.error(error);
  }
});

export default router;
