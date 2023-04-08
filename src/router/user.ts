import express, { Request, Response } from "express";
import bycript from "bcrypt";
import {
  createDataBase,
  deleteDataBase,
  readDataBase,
  readDataBaseJoin,
} from "../database/database";
import axios from "axios";
// import { getUser } from "../controller/userController";

const userRouter = express.Router();

// userRouter.get("/", getUser);

userRouter.post("/", async (req: Request, res: Response) => {
  const to_db = {
    email: req.body.email,
    name: req.body.name,
    point: 0,
    level: 0,
    password: bycript.hashSync(req.body.password, 8),
  };
  const email_auth: any = await readDataBase(
    "email_auth",
    ["is_auth"],
    `email='${req.body.email}'`
  );
  if (!email_auth[0][0].is_auth) {
    return res.status(200).json({
      result: true,
      message: "이메일 인증을 완료해주세요.",
    });
  }
  try {
    await createDataBase("user", to_db);
    await deleteDataBase("email_auth", `email='${to_db.email}'`);
    return res.status(200).json({
      result: true,
      message: "회원 가입을 완료했습니다.",
    });
  } catch (error) {
    return res.status(200).json({
      result: true,
      message: "회원 가입에 실패했습니다.",
    });
  }
});

export default userRouter;
