import express, { Request, Response } from "express";
import bycript from "bcrypt";
import {
  createDataBase,
  deleteDataBase,
  readDataBase,
  readDataBaseJoin,
} from "../database/database";
import { getUser } from "../controller/userController";

const userRouter = express.Router();

userRouter.get("/", getUser);

userRouter.post("/", async (req: Request, res: Response) => {
  const to_db = {
    email: req.body.email,
    name: req.body.name,
    position: req.body.position,
    user_type: req.body.position,
    play_type: req.body.position,
    point: 0,
    level: 0,
    password: bycript.hashSync(req.body.password, 8),
  };
  const email_auth: any = await readDataBase(
    "email_auth",
    ["email", "auth_num"],
    `email='${to_db.email}'`
  );
  const fullReselt = email_auth[0][0];
  if (fullReselt.length === 0) return;
  if (fullReselt.auth_num === req.body.auth_num) {
    try {
      await createDataBase("user", to_db);
      await deleteDataBase("email_auth", `email='${to_db.email}'`);
      return res.status(200).json({
        result: true,
        message: "회원 가입을 완료했습니다.",
      });
    } catch (error) {
      console.log(error);
    }
  } else
    return res.status(400).json({
      result: true,
      message: "인증번호가 잘못되었습니다.",
    });
  try {
    await createDataBase("user", to_db);
    await deleteDataBase("email_auth", `email='${to_db.email}'`);
    return res.status(200).json({
      result: true,
      message: "회원 가입을 완료했습니다.",
    });
  } catch (error) {
    console.log(error);
  }
});

export default userRouter;
