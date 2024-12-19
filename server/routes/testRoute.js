import express from "express";
const testRouter = express.Router();

testRouter.get("/test", (req, res) => {
  return res.json({
    success: true,
    message: "Test Successfully",
  });
});
export default testRouter;
