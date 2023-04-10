import express, { Request, Response } from "express";
import {
  createDataBase,
  deleteDataBase,
  readDataBase,
  updateDataBase,
} from "../database/database";
import { emailSend, authNumGenerater } from "../utils/send_email";
import bycript from "bcrypt";
import jwt from "jsonwebtoken";
import { signUpAuthNumHTML } from "../public/html_gen/signup_auth";
import { getUser } from "../controller/userController";
const authRouter = express.Router();

const SECRET_KEY = "BUCWEXFYH2J3K5N6P7R9SATCVD";

authRouter.post("/login", async (req: Request, res: Response) => {
  const result: any = await readDataBase(
    "user",
     "all",
    `email='${req.body.email}'`
  );
  const fullReselt = result[0][0];
  if (fullReselt) {
    if (bycript.compareSync(req.body.password, fullReselt.password)) {
      const accessToken = jwt.sign(
        { id: fullReselt.id },
        SECRET_KEY
      );
      res.cookie("accessToken", accessToken);
      return res.status(200).json({
        result: true,
        message: `로그인 되었습니다. ${fullReselt.name} 님 환영합니다.`,
        user: {
          name:fullReselt.name,
          email:fullReselt.email,
          position:fullReselt.position,
          play_type:fullReselt.play_type,
          contact:fullReselt.contact,
          point:fullReselt.point,
          level:fullReselt.level,
          tags:fullReselt.tags,
          location:fullReselt.location,
          gender:fullReselt.gender,
        },
        accessToken,
      });
    } else {
      return res.status(400).json({
        result: false,
        message: "이메일 / 비밀번호를 다시 확인해주세요.",
      });
    }
  } else {
    return res.status(400).json({
      result: false,
      message: "이메일 / 비밀번호를 다시 확인해주세요.",
    });
  }
});

authRouter.post("/signup_email", async (req: Request, res: Response) => {
  const auth_num = authNumGenerater();
  const to_db = {
    email: req.body.email,
    auth_num,
    is_auth: 0,
  };
  try {
    emailSend(
      "플랩풋볼 회원 가입 인증번호 이메일",
      to_db.email,
      "플랩풋볼 회원 가입을 위해 인증번호를 입력해주세요.",
      signUpAuthNumHTML(auth_num)
    );
    await createDataBase("email_auth", to_db);
    return res.status(200).json({
      result: true,
      message:
        "인증 메일을 전송했습니다. 회원 가입을 위해 인증을 진행해주세요.",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      result: false,
      message: "인증 메일 전송에 실패했습니다.",
    });
  }
});

authRouter.post("/done", async (req, res) => {
  try {
    const db_email_auth = await readDataBase(
      "email_auth",
      ["auth_num", "email"],
      `email="${req.body.email}"`
    );
    if (db_email_auth[0][0].auth_num === req.body.auth_num) {
      await updateDataBase(
        "email_auth",
        { is_auth: 1 },
        `email='${req.body.email}'`
      );
      return res.status(200).json({
        result: true,
        message:
          "이메일 인증이 성공적으로 완료되었습니다. 다음 정보를 기입해주세요.",
      });
    } else {
      return res.status(200).json({
        result: false,
        message: "인증번호를 다시 확인해주세요.",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      result: false,
      message: "인증에 실패했습니다.",
    });
  }
});

authRouter.delete("/timeout", async (req, res) => {
  await deleteDataBase("email_auth", `email='${req.body.email}'`);
  return res.status(200).json({
    result: false,
    message: "시간이 초과되었습니다.",
  });
});

authRouter.get("/logout", (_, res) => {
  res.clearCookie("accessToken");
  return res.status(200).json({
    message: "로그아웃 되었습니다.",
  });
});

export default authRouter;
