import axios from "axios";
import express, { Request, Response } from "express";

const paymentRouter = express.Router();
const secretKey = "test_sk_aBX7zk2yd8yjvj51yRX3x9POLqKQ";

paymentRouter.post("/", async (req: Request, res: Response) => {
  try{
    const { orderId, paymentKey, amount } = req.body;
    const url = "https://api.tosspayments.com/v1/payments/confirm";
    const basicToken = Buffer.from(`${secretKey}:`, "utf-8").toString("base64");
    const options = {
        method: 'POST',
        url,
        headers: {
            Authorization: `Basic ${basicToken}`,
            'Content-Type': 'application/json'
        },
        data: { orderId, paymentKey, amount }
    };
    await axios.request(options)
    return res.send("결제 완료")
  }catch(error){
    return res.send("결제 실패")
  }
});

export default paymentRouter;
