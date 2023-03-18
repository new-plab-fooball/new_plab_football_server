import { Request, Response } from "express";
import { getUserData } from "../model/userModel";

export const getUser = async <T>(req: Request, res: Response) => {
  try {
    const row = await getUserData(req.params.id);

    if (row > 0) {
      return res.status(200).json({
        result: true,
        message: "회원 정보를 불러왔습니다.",
        data: row,
      });
    }

    if (row < 0) {
      return res.status(500).json({
        result: false,
        message: "DB Connection 오류입니다.",
        data: null,
      });
    }

    return res.status(400).json({
      result: false,
      message: "회원 정보를 불러오지 못했습니다.",
      data: null,
    });
  } catch (err) {
    console.error(err);
  }
};
