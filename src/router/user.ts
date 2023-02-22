import express, { Request, Response } from 'express';
import bycript from 'bcrypt';
import {
  createDataBase,
  deleteDataBase,
  readDataBase,
  readDataBaseJoin,
} from '../data/database';
//import getUser from '../controller/userController';
const getUser = require('../controller/userController');

const userRouter = express.Router();

userRouter.get('/', getUser);

userRouter.post('/', async (req: Request, res: Response) => {
  const to_db = {
    ...req.body,
    password: bycript.hashSync(req.body.password, 8),
    like_count: 0,
  };
  const email_auth: any = await readDataBase(
    'email_auth',
    ['email', 'auth_num'],
    `email='${to_db.email}'`
  );
  const fullReselt = email_auth[0][0];
  if (fullReselt.length === 0) return;
  if (fullReselt.auth_num === to_db.auth_num) {
    try {
      delete to_db.auth_num;
      await createDataBase('user', to_db);
      await deleteDataBase('email_auth', `email='${to_db.email}'`);
      return res.status(200).json({
        result: true,
        message: '회원 가입을 완료했습니다.',
      });
    } catch (error) {
      console.log(error);
    }
  } else
    return res.status(400).json({
      result: true,
      message: '인증번호가 잘못되었습니다.',
    });
  try {
    await createDataBase('user', to_db);
    await deleteDataBase('email_auth', `email='${to_db.email}'`);
    return res.status(200).json({
      result: true,
      message: '회원 가입을 완료했습니다.',
    });
  } catch (error) {
    console.log(error);
  }
});

userRouter.get('/:page', async (req: Request, res: Response) => {
  const from_db: any = await readDataBase(
    'user',
    [
      'id',
      'name',
      'images',
      'contact',
      'position',
      'field',
      'skills',
      'like_count',
    ],
    null,
    `${(Number(req.params.page) - 1) * 10},10`
  );
  try {
    return res.status(200).json({
      result: true,
      message: from_db[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      result: false,
      message: '유저 목록을 불러오지 못했습니다.',
    });
  }
});

userRouter.get('/detail/:id', async (req: Request, res: Response) => {
  try {
    const from_db: any = await readDataBaseJoin(
      {
        user: [
          'id',
          'contact',
          'images',
          'tendency',
          'field',
          'position',
          'intro',
          'skills',
          'like_count',
        ],
        user_review: ['id', 'rating', 'content', 'user'],
      },
      ['user.id', 'user_review.user'],
      `user.id = ${req.params.id}`
    );

    const review = from_db[0].map((el: any) => {
      return {
        id: el.user_review_id,
        rating: el.user_review_rating,
        content: el.user_review_content,
      };
    });

    const data = {
      id: from_db[0][0].user_id,
      contact: from_db[0][0].user_contact,
      images: from_db[0][0].user_images,
      tendency: from_db[0][0].user_tendency,
      field: from_db[0][0].field,
      position: from_db[0][0].user_position,
      intro: from_db[0][0].user_intro,
      skills: from_db[0][0].user_skills,
      like_count: from_db[0][0].user_like_count,
      review,
    };

    return res.status(200).json({
      result: true,
      message: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      result: false,
      message: '유저를 불러오지 못했습니다.',
    });
  }
});

export default userRouter;
