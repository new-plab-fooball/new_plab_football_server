import jwt from 'jsonwebtoken';
import { Request } from 'express';
const SECRET_KEY = 'BUCWEXFYH2J3K5N6P7R9SATCVD';

export const userInfo = (req: Request) => {
  let user;
  jwt.verify(
    req.cookies.accessToken,
    SECRET_KEY,
    async (error: any, decoded: any) => {
      if (error) console.log(error);
      if (decoded) user = decoded;
    }
  );
  return user;
};
