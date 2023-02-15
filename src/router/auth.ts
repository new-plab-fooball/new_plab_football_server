import express, { Request, Response } from 'express';
import { createDataBase, readDataBase, updateDataBase } from '../data/database';
import { EmailSend, _AuthNum_Generater } from '../utils/send_email';
import bycript from 'bcrypt';
import jwt from 'jsonwebtoken';
import { signUpAuthNumHTML } from '../../src/utils/send_email_html';
const authRouter = express.Router();

const SECRET_KEY = 'BUCWEXFYH2J3K5N6P7R9SATCVD';

authRouter.post('/login', async (req: Request, res: Response) => {
  const result: any = await readDataBase(
    'user',
    ['id', 'email', 'password', 'name'],
    `email='${req.body.email}'`
  );
  const fullReselt = result[0][0];
  if (fullReselt) {
    if (bycript.compareSync(req.body.password, fullReselt.password)) {
      const accessToken = jwt.sign(
        { id: fullReselt.id, email: fullReselt.email, name: fullReselt.name },
        SECRET_KEY
      );
      res.cookie('accessToken', accessToken);
      return res.status(200).json({
        result: true,
        message: `로그인 되었습니다. ${fullReselt.name} 님 환영합니다.`,
        accessToken,
      });
    } else {
      return res.status(400).json({
        result: false,
        message: '이메일 / 비밀번호를 다시 확인해주세요.',
      });
    }
  } else {
    return res.status(400).json({
      result: false,
      message: '이메일 / 비밀번호를 다시 확인해주세요.',
    });
  }
});

authRouter.post('/signup', async (req: Request, res: Response) => {
  const auth_num = _AuthNum_Generater();
  const to_db = {
    ...req.body,
    auth_num,
  };
  try {
    EmailSend(
      '토이 스쿼드 회원 가입 인증번호 이메일',
      to_db.email,
      '토이 스쿼드 회원 가입을 위해 인증번호를 입력해주세요.',
      signUpAuthNumHTML(auth_num)
    );
    await createDataBase('email_auth', to_db);
    return res.status(200).json({
      result: true,
      message:
        '인증 메일을 전송했습니다. 회원 가입을 위해 인증을 진행해주세요.',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      result: false,
      message: '인증 메일 전송에 실패했습니다.',
    });
  }
});

authRouter.get('/logout', (_, res) => {
  res.clearCookie('accessToken');
  return res.status(200).json({
    message: '로그아웃 되었습니다.',
  });
});

export default authRouter;
