import express, { Request, Response } from 'express';
import { userInfo } from '../../src/utils/user_info';
import {
  createDataBase,
  deleteDataBase,
  updateDataBase,
} from '../data/database';
const reviewRouter = express.Router();

reviewRouter.post('/user', async (req: Request, res: Response) => {
  const user_info: any = userInfo(req);
  const to_db = {
    ...req.body,
    user: user_info.id,
  };
  try {
    await createDataBase('user_review', to_db);
    return res.status(200).json({
      result: true,
      message: '유저에 대한 리뷰를 작성했습니다.',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      result: false,
      message: '해당 유저에 대한 리뷰 작성에 실패했습니다.',
    });
  }
});

reviewRouter.put('/user', async (req: Request, res: Response) => {
  try {
    await updateDataBase('user_review', req.body, `id=${req.body.id}`);
    return res.status(200).json({
      result: true,
      message: '유저에 대한 리뷰를 수정했습니다.',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      result: false,
      message: '해당 유저에 대한 리뷰 수정에 실패했습니다.',
    });
  }
});

reviewRouter.delete('/user/:id', async (req: Request, res: Response) => {
  try {
    await deleteDataBase('user_review', `id=${req.params.id}`);
    return res.status(200).json({
      result: true,
      message: '유저에 대한 리뷰를 삭제했습니다.',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      result: false,
      message: '해당 유저에 대한 리뷰 삭제에 실패했습니다.',
    });
  }
});

reviewRouter.post('/result', async (req: Request, res: Response) => {
  const user_info: any = userInfo(req);
  const to_db = {
    ...req.body,
    user: user_info.id,
  };
  try {
    await createDataBase('result_review', to_db);
    return res.status(200).json({
      result: true,
      message: '완성작에 대한 리뷰를 작성했습니다.',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      result: false,
      message: '해당 완성작에 대한 리뷰 작성에 실패했습니다.',
    });
  }
});

reviewRouter.put('/result', async (req: Request, res: Response) => {
  try {
    await updateDataBase('result_review', req.body, `id=${req.body.id}`);
    return res.status(200).json({
      result: true,
      message: '완성작에 대한 리뷰를 수정했습니다.',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      result: false,
      message: '해당 완성작에 대한 리뷰 수정에 실패했습니다.',
    });
  }
});

reviewRouter.delete('/result/:id', async (req: Request, res: Response) => {
  try {
    await deleteDataBase('result_review', `id=${req.params.id}`);
    return res.status(200).json({
      result: true,
      message: '완성작에 대한 리뷰를 삭제했습니다.',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      result: false,
      message: '해당 완성작에 대한 리뷰 삭제에 실패했습니다.',
    });
  }
});

export default reviewRouter;
