import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { readDataBase } from "../database/database";

const SECRET_KEY = "BUCWEXFYH2J3K5N6P7R9SATCVD";

export const getUser = async <T>(req: Request, res: Response) => {
    jwt.verify(
        req.cookies.accessToken,
        SECRET_KEY,
        async (error: Error,decoded: any) => {
            if(decoded){
                try {
                    const result: any = await readDataBase(
                        "user",
                        ["email", "name", "position", "play_type","contact","point","level","tags","location","gender"],
                        `id='${decoded.id}'`
                    );
                    if(result[0].length > 0){
                    return res.status(200).json({
                        result: true,
                        message: result[0][0],
                        data: null,
                        });
                    }else{
                    return res.status(400).json({
                        result: true,
                        message: "존재하지 않는 회원 정보 입니다.",
                        data: null,
                    });
                    }
                  } catch (err) {
                    console.error(err);
                  }
            }
            if(error){
                console.log(error)
                return res.status(400).json({
                    result: false,
                    message: "에러가 발생했습니다.",
                    data: null,
                  });
            }
    })

};
