import axios from "axios";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { readDataBase, updateDataBase } from "../database/database";

const paymentRouter = express.Router();
const secretKey = "test_sk_aBX7zk2yd8yjvj51yRX3x9POLqKQ";
const SECRET_KEY = "BUCWEXFYH2J3K5N6P7R9SATCVD";

paymentRouter.post("/", async (req: Request, res: Response) => {
  const userInfo:any = jwt.verify(req.cookies.accessToken, SECRET_KEY)
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
    }
    await axios.request(options)
    const user =  await readDataBase('user',["point"],`id='${userInfo.id}'`)
    await updateDataBase(
      "user",
      { point:Number(user[0][0].point) + Number(amount) },
      `id='${userInfo.id}'`
    );
    return res.send("결제 완료")
  }catch(error){
    return res.send("결제 실패")
  }
});

export default paymentRouter;
